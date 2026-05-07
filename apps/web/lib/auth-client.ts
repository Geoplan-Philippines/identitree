import { createAuthClient } from "better-auth/react";
import { organizationClient, inferOrgAdditionalFields } from "better-auth/client/plugins";

import { getAuthApiBaseUrl } from "@/lib/api/config";

export const authClient = createAuthClient({
  baseURL: getAuthApiBaseUrl(),
  plugins: [
    organizationClient({
      schema: inferOrgAdditionalFields({
        organization: {
          additionalFields: {
            website: {
              type: "string",
              required: false,
            },
          },
        },
      }),
    }),
  ],
});
