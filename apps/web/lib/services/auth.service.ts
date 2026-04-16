import { apiClient } from "@/lib/api/client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
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

export type CreateOrganizationPayload = {
  userId: string;
  name: string;
  slug: string;
};

export type UserOrganizationResponse = {
  organizationSlug: string | null;
  hasOrganization: boolean;
};

export type CreateOrganizationResponse = {
  organizationSlug: string;
  alreadyMember: boolean;
};

export type VerificationTokenStatusResponse = {
  status: "ready" | "already-verified" | "expired" | "invalid";
  email?: string;
};

class AuthService {
  register(payload: RegisterPayload) {
    return apiClient.post<{ token: string | null; user: AuthUser }>(
      "/auth/sign-up/email",
      payload,
    );
  }

  login(payload: LoginPayload) {
    return apiClient.post<{ token: string | null; user: AuthUser }>(
      "/auth/sign-in/email",
      payload,
    );
  }

  getSession() {
    return apiClient.request<BetterAuthSessionResponse>("/auth/get-session");
  }

  getVerificationTokenStatus(token: string) {
    return apiClient.request<VerificationTokenStatusResponse>(
      `/auth/verification-token-status?token=${encodeURIComponent(token)}`,
    );
  }

  getUserOrganization(userId: string) {
    return apiClient.request<UserOrganizationResponse>(
      `/auth/organization/${userId}`,
    );
  }

  createOrganization(payload: CreateOrganizationPayload) {
    return apiClient.post<CreateOrganizationResponse>(
      "/auth/organization",
      payload,
    );
  }
}

export const authService = new AuthService();
