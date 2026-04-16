import { createAuthClient } from "better-auth/react";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

const authClientOptions = {
  baseURL,
  basePath: "/auth",
} as const;

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  authClientOptions,
);
