import { requireUser } from "@/lib/auth/redirects";
import { AccountClient } from "@/components/account/account-client";

export default async function AccountPage() {
  const session = await requireUser();

  return <AccountClient user={session.user} />;
}
