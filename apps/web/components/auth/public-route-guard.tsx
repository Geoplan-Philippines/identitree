"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-provider";

export function PublicRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isHydrated, isAuthenticated, organizationSlug, user } = useAuth();

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;

    if (organizationSlug) {
      router.replace(`/dashboard/${organizationSlug}`);
      return;
    }

    if (user?.id) {
      router.replace(`/organization/setup?userId=${user.id}`);
      return;
    }

    router.replace("/organization/setup");
  }, [isHydrated, isAuthenticated, organizationSlug, router, user?.id]);

  if (!isHydrated) return null;
  if (isAuthenticated) return null;

  return <>{children}</>;
}
