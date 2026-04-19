import { createAuthClient } from "better-auth/react";

import { getAuthApiBaseUrl } from "@/lib/api/config";

const authClientOptions = {
  baseURL: getAuthApiBaseUrl(),
} as const;

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  authClientOptions,
);
