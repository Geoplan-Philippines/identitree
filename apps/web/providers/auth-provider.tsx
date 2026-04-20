"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { authClient } from "@/lib/auth-client";
import { type AuthResponse, type AuthUser } from "@/lib/services/auth.service";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  organizationSlug: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  organizationSlug: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (payload: AuthResponse) => void;
  setOrganizationSlug: (slug: string | null) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: sessionData, isPending: isSessionPending } =
    authClient.useSession();
  const { data: activeOrg, isPending: isOrgPending } =
    authClient.useActiveOrganization();

  const user = (sessionData?.user as AuthUser) || null;
  const token = sessionData?.session.token || null;
  const organizationSlug = activeOrg?.slug || null;

  const setAuth = useCallback((payload: AuthResponse) => {
    // Better Auth's useSession is reactive, so manual setting is usually not needed.
    // For compatibility with legacy manual login calls, we log the call.
    // Ideally, consumers should switch to authClient.signIn.* or authClient.useSession().
    console.debug(
      "setAuth called. Session should update reactively via Better Auth hooks.",
      payload,
    );
  }, []);

  const setOrganizationSlug = useCallback(async (slug: string | null) => {
    await authClient.organization.setActive({
      organizationSlug: slug ?? undefined,
    });
  }, []);

  const clearAuth = useCallback(async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      organizationSlug,
      isAuthenticated: Boolean(user),
      isHydrated: !isSessionPending && (!user || !isOrgPending),
      setAuth,
      setOrganizationSlug,
      clearAuth,
    }),
    [
      user,
      token,
      organizationSlug,
      isSessionPending,
      isOrgPending,
      setAuth,
      setOrganizationSlug,
      clearAuth,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
