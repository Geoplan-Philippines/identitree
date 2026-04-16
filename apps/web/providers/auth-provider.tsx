"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authService, type AuthResponse, type AuthUser } from "@/lib/services/auth.service";

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
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    organizationSlug: null,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function hydrateFromSessionCookie() {
      try {
        const session = await authService.getSession();

        if (!session?.user?.id) {
          setState({ user: null, token: null, organizationSlug: null });
          setIsHydrated(true);
          return;
        }

        const organization = await authService.getUserOrganization(session.user.id);

        setState({
          user: session.user,
          token: session.session.token,
          organizationSlug: organization.organizationSlug,
        });
      } catch {
        setState({ user: null, token: null, organizationSlug: null });
      } finally {
        setIsHydrated(true);
      }
    }

    void hydrateFromSessionCookie();
  }, []);

  const setAuth = useCallback((payload: AuthResponse) => {
    const nextState: AuthState = {
      user: payload.user,
      token: payload.token,
      organizationSlug: payload.organizationSlug,
    };

    setState(nextState);
  }, []);

  const setOrganizationSlug = useCallback((slug: string | null) => {
    setState((prev) => {
      return { ...prev, organizationSlug: slug };
    });
  }, []);

  const clearAuth = useCallback(() => {
    setState({ user: null, token: null, organizationSlug: null });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      token: state.token,
      organizationSlug: state.organizationSlug,
      isAuthenticated: Boolean(state.user),
      isHydrated,
      setAuth,
      setOrganizationSlug,
      clearAuth,
    }),
    [state, isHydrated, setAuth, setOrganizationSlug, clearAuth],
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
