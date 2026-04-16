import type { ReactNode } from "react";

import { PublicRouteGuard } from "@/components/auth/public-route-guard";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <PublicRouteGuard>{children}</PublicRouteGuard>;
}
