import { VerifyEmailStatus } from "@/components/auth/verify-email-status";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";

export default async function VerifyEmailPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return <VerifyEmailStatus />;
}
