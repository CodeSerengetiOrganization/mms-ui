"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchFailedProducts } from "@/lib/failed-products";
import type { FailedProductDto } from "@/lib/types";
import type { AppError } from "@/lib/errors";

function getTotalFailedCount(item: FailedProductDto): number {
  return item.failedProductCount?.reduce((a, b) => a + b, 0) ?? 0;
}

export default function FailedProductsBlock() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [data, setData] = useState<FailedProductDto[] | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchFailedProducts(4);
    setLoading(false);
    if (result.ok) {
      setData(result.data);
    } else {
      setError(result.error);
      setData(null);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showRetry =
    error &&
    (error.type === "SERVER_ERROR" ||
      error.type === "NETWORK_ERROR" ||
      error.type === "UNKNOWN_ERROR");

  return (
    <section className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Failed Products
      </h2>

      {loading && (
        <div className="flex items-center justify-center py-12 text-zinc-500 dark:text-zinc-400">
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-400" />
          Loading failed products…
        </div>
      )}

      {!loading && error && (
        <div
          className={`rounded-md border p-4 ${
            error.type === "VALIDATION_ERROR" || error.type === "NOT_FOUND"
              ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
              : "border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-950/20"
          }`}
        >
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {error.message}
          </p>
          {showRetry && (
            <button
              type="button"
              onClick={load}
              className="mt-3 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {!loading && !error && data && data.length === 0 && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 py-6 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            No failed products found — great job!
          </p>
        </div>
      )}

      {!loading && !error && data && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="pb-2 pr-4 font-medium text-zinc-600 dark:text-zinc-400">
                  Machine
                </th>
                <th className="pb-2 pr-4 font-medium text-zinc-600 dark:text-zinc-400">
                  Rack
                </th>
                <th className="pb-2 pr-4 font-medium text-zinc-600 dark:text-zinc-400">
                  Channel
                </th>
                <th className="pb-2 pr-4 font-medium text-zinc-600 dark:text-zinc-400">
                  Total failed
                </th>
                <th className="pb-2 pr-4 font-medium text-zinc-600 dark:text-zinc-400">
                  Severity
                </th>
                <th className="pb-2 font-medium text-zinc-600 dark:text-zinc-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-zinc-100 dark:border-zinc-800"
                >
                  <td className="py-2 pr-4 text-zinc-900 dark:text-zinc-100">
                    {row.machineId ?? "—"}
                  </td>
                  <td className="py-2 pr-4 text-zinc-700 dark:text-zinc-300">
                    {row.rackId ?? "—"}
                  </td>
                  <td className="py-2 pr-4 text-zinc-700 dark:text-zinc-300">
                    {row.channelNumber ?? "—"}
                  </td>
                  <td className="py-2 pr-4 font-medium text-zinc-900 dark:text-zinc-100">
                    {getTotalFailedCount(row)}
                  </td>
                  <td className="py-2 pr-4">
                    <span
                      className={
                        row.severity === "critical"
                          ? "text-red-600 dark:text-red-400"
                          : row.severity === "high"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-zinc-600 dark:text-zinc-400"
                      }
                    >
                      {row.severity ?? "—"}
                    </span>
                  </td>
                  <td className="py-2 text-zinc-700 dark:text-zinc-300">
                    {row.status ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
