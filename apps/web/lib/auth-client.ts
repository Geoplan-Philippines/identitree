import { createAuthClient } from "better-auth/react";
import { getAuthBaseURL } from "@/lib/base-url";

const authClientOptions = {
  baseURL: getAuthBaseURL(),
} as const;

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  authClientOptions,
);
