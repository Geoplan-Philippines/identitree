import { apiClient } from "@/lib/api/client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type AuthResponse = {
  token: string | null;
  user: AuthUser;
  organizationSlug: string | null;
};

export type BetterAuthSessionResponse = {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
  };
  user: AuthUser;
} | null;

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type VerificationTokenStatusResponse = {
  status: "ready" | "already-verified" | "expired" | "invalid";
  email?: string;
};

class AuthService {
  getSession() {
    return apiClient.request<BetterAuthSessionResponse>("/auth/get-session");
  }

}

export const authService = new AuthService();
