import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";

import { createApiUrl } from "@/lib/api/config";

export type AppSession = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    emailVerified?: boolean;
  };
  organizationSlug: string | null;
};

type BetterAuthSessionResponse = {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
  };
  user: AppSession["user"];
} | null;

type BetterAuthOrganization = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  metadata?: any;
  createdAt: Date;
};

async function requestAuthApi<T>(
  path: string,
  cookieHeader: string,
): Promise<T | null> {
  const response = await fetch(createApiUrl(path), {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403 || response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    console.error(`Auth request failed: GET ${path} -> ${response.status}`, errorBody);
    return null;
  }

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error(`Failed to parse auth response for ${path}:`, text);
    return null;
  }
}

export const getSession = cache(async (): Promise<AppSession | null> => {
  try {
    const cookieHeader = (await cookies()).toString();
    const session = await requestAuthApi<BetterAuthSessionResponse>(
      "/auth/get-session",
      cookieHeader,
    );

    if (!session?.user?.id) {
      return null;
    }

    // Better Auth Organization Plugin provides /organization/list
    // Treat null as empty array - user may not have organizations yet (new signup)
    const organizations = await requestAuthApi<BetterAuthOrganization[]>(
      "/auth/organization/list",
      cookieHeader,
    ) || [];

    // Pick the first organization as the "active" one for legacy redirection compatibility
    const activeOrganization = organizations[0] || null;

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        emailVerified: session.user.emailVerified,
      },
      organizationSlug: activeOrganization?.slug ?? null,
    };
  } catch (error) {
    // If the error is a Next.js dynamic server usage error, we must re-throw it
    // so Next.js can correctly handle bailing from static generation.
    if (error instanceof Error && (error as any).digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }

    console.error("Critical error in getSession helper:", error);
    return null;
  }
});
