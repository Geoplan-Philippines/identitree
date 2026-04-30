import { NextRequest, NextResponse } from "next/server";
import { createApiUrl } from "@/lib/api/config";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const apiUrl = createApiUrl("/profiles");

  try {
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
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
