"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-provider";

type AuthGuardMode = "public" | "protected";

type AuthGuardProps = {
  children: React.ReactNode;
  mode: AuthGuardMode;
  requireOrganization?: boolean;
  redirectIfHasOrganization?: boolean;
};

export function AuthGuard({
  children,
  mode,
  requireOrganization = false,
  redirectIfHasOrganization = false,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isHydrated, isAuthenticated, organizationSlug, user } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;

    if (mode === "public") {
      if (!isAuthenticated) return;

      if (organizationSlug) {
        router.replace(`/dashboard/${organizationSlug}`);
        return;
      }

      if (user?.id) {
        router.replace(`/organization/setup?userId=${user.id}`);
        return;
      }

      router.replace("/organization/setup");
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (redirectIfHasOrganization && organizationSlug) {
      router.replace(`/dashboard/${organizationSlug}`);
      return;
    }

    if (requireOrganization) {
      if (!organizationSlug) {
        if (user?.id) {
          router.replace(`/organization/setup?userId=${user.id}`);
          return;
        }

        router.replace("/organization/setup");
        return;
      }

      const pathSegments = pathname.split("/").filter(Boolean);
      if (
        pathSegments[0] === "dashboard" &&
        pathSegments[1] &&
        pathSegments[1] !== organizationSlug
      ) {
        router.replace(`/dashboard/${organizationSlug}`);
      }
    }
  }, [
    isHydrated,
    isAuthenticated,
    mode,
    organizationSlug,
    pathname,
    redirectIfHasOrganization,
    requireOrganization,
    router,
    user?.id,
  ]);

  if (!isHydrated) return null;

  if (mode === "public") {
    if (isAuthenticated) return null;
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;
  if (redirectIfHasOrganization && organizationSlug) return null;
  if (requireOrganization && !organizationSlug) return null;

  return <>{children}</>;
}
