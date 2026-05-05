import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AuthProvider } from "@/providers/auth-provider";
import { requireUser } from "@/lib/auth/redirects";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireUser();

  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
