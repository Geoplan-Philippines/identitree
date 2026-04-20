import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

import { getAuthApiBaseUrl } from "@/lib/api/config";

export const authClient = createAuthClient({
  baseURL: getAuthApiBaseUrl(),
  plugins: [organizationClient()],
});
