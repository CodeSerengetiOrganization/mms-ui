import type { FailedProductDto, MachineStatusResponse, ChartDataPoint } from "@/lib/types";
import { ERROR_MESSAGES, type AppError, type ErrorType } from "@/lib/errors";

/**
 * Use the Next.js rewrite (same origin) to avoid CORS.
 * Frontend calls `/api/machines/status`, which Next.js rewrites to the backend service.
 * On the server, we fall back to:
 * - local (e.g. pnpm dev): http://localhost:8080/api (port-forward)
 * - K3s (NODE_ENV prod/dev/sit): http://mms-backend-service:8080/api
 */
const getApiUrl = (): string => {
  if (typeof window !== "undefined") {
    return "/api/machines/status";
  }

  const useK3sBackend = ["prod", "dev", "sit", "production"].includes(
    process.env.NODE_ENV ?? ""
  );
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    (useK3sBackend
      ? "http://mms-backend-service:8080/api"
      : "http://localhost:8080/api");

  const version = process.env.NEXT_PUBLIC_API_VERSION ?? "v1";
  return `${base}/${version}/machines/status`;
};

function createAppError(type: ErrorType, originalError?: unknown): AppError {
  return {
    type,
    message: ERROR_MESSAGES[type],
    originalError,
  };
}

export type FailedProductsResult =
  | { ok: true; data: FailedProductDto[] }
  | { ok: false; error: AppError };

/**
 * Fetches failed products from the machines/status API.
 * Uses NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_API_VERSION (default v1).
 */
export async function fetchFailedProducts(
  machineId: number = 4,
  rackId?: number,
  channelNumber?: number
): Promise<FailedProductsResult> {
  const url = getApiUrl();
  const body: { machineId: number; rackId?: number; channelNumber?: number } = {
    machineId,
  };
  if (rackId !== undefined) body.rackId = rackId;
  if (channelNumber !== undefined) body.channelNumber = channelNumber;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (res.status === 400) {
        let message = ERROR_MESSAGES.VALIDATION_ERROR;
        try {
          const json = await res.json();
          if (json?.message) message = json.message;
          else if (Array.isArray(json?.errors))
            message = json.errors.map((e: { defaultMessage?: string }) => e.defaultMessage ?? "").filter(Boolean).join(", ") || message;
        } catch {
          // use default
        }
        return { ok: false, error: { type: "VALIDATION_ERROR", message, originalError: res } };
      }
      if (res.status === 404)
        return { ok: false, error: createAppError("NOT_FOUND", res) };
      if (res.status >= 500)
        return { ok: false, error: createAppError("SERVER_ERROR", res) };
      return { ok: false, error: createAppError("UNKNOWN_ERROR", res) };
    }

    const data = (await res.json()) as MachineStatusResponse;
    const failedProducts = data.failedProducts ?? [];
    return { ok: true, data: failedProducts };
  } catch (err) {
    const isNetwork =
      err instanceof TypeError && (err.message === "Failed to fetch" || err.message?.includes("network"));
    if (isNetwork) return { ok: false, error: createAppError("NETWORK_ERROR", err) };
    return { ok: false, error: createAppError("UNKNOWN_ERROR", err) };
  }
}

/**
 * Transforms failed products into chart-ready series (one per product).
 * Matches Angular processChartData: each series is { name: "Batch N", value: count }[].
 */
export function processChartData(failedProducts: FailedProductDto[]): ChartDataPoint[][] {
  return failedProducts.map((data) =>
    (data.failedProductCount ?? []).map((count, batchIndex) => ({
      name: `Batch ${batchIndex + 1}`,
      value: count,
    }))
  );
}
