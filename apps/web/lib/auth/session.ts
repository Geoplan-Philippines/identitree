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

type UserOrganizationResponse = {
  organizationSlug: string | null;
  hasOrganization: boolean;
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
    throw new Error(`Auth request failed with status ${response.status}`);
  }

  const text = await response.text();
  if (!text) return null;

  return JSON.parse(text) as T;
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

    const organization = await requestAuthApi<UserOrganizationResponse>(
      `/auth/organization/${encodeURIComponent(session.user.id)}`,
      cookieHeader,
    );

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        emailVerified: session.user.emailVerified,
      },
      organizationSlug: organization?.organizationSlug ?? null,
    };
  } catch {
    return null;
  }
});
