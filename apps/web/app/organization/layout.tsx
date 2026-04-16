import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";

export default function OrganizationLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode="protected" redirectIfHasOrganization>
      {children}
    </AuthGuard>
  );
}
