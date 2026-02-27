import { NextRequest, NextResponse } from "next/server";

const getBackendUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";
  const version = process.env.NEXT_PUBLIC_API_VERSION ?? "v1";
  return `${base}/${version}/machines/status`;
};

/**
 * Proxy POST to backend machines/status to avoid CORS when the browser calls this route.
 * Backend must be reachable from the Next.js server (e.g. port-forward to 8080 or use cluster URL).
 */
export async function POST(request: NextRequest) {
  const url = getBackendUrl();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy to backend failed:", err);
    return NextResponse.json(
      { message: "Backend unavailable" },
      { status: 502 }
    );
  }
}
