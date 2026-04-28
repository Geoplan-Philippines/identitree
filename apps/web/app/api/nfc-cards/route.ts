import { NextRequest, NextResponse } from "next/server";
import { createApiUrl } from "@/lib/api/config";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  // Forward the request to the NestJS API using helpers
  // Use the full /api/v1/nfc-cards path for the backend
  const apiUrl = createApiUrl("/nfc-cards");
  const res = await fetch(apiUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(req.headers.get("cookie") ? { cookie: req.headers.get("cookie")! } : {}),
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
