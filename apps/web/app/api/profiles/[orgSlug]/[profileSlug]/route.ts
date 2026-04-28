import { NextRequest, NextResponse } from "next/server";
import { createApiUrl } from "@/lib/api/config";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgSlug: string; profileSlug: string }> }
) {
  const { orgSlug, profileSlug } = await params;
  const apiUrl = createApiUrl(`/profiles/${orgSlug}/${profileSlug}`);

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Profile not found" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching profile ${orgSlug}/${profileSlug}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
