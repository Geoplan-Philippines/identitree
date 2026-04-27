import type { ReactNode } from "react";
import { AuthProvider } from "@/providers/auth-provider";

export default function OrganizationLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
