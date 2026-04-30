import { NextRequest, NextResponse } from "next/server";
import { createApiUrl } from "@/lib/api/config";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // Forward all query params (from, to, profileId, channel) to the NestJS API
  const searchParams = req.nextUrl.searchParams.toString();
  const apiUrl = createApiUrl(`/analytics/stats/${slug}${searchParams ? `?${searchParams}` : ""}`);

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
    console.error(`Error fetching analytics stats for ${slug}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
