import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";

function getOrganizationSetupPath(userId?: string) {
  if (!userId) return "/organization/setup";

  return `/organization/setup?userId=${encodeURIComponent(userId)}`;
}

export async function requireUser() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireOrganization() {
  const session = await requireUser();

  if (!session.organizationSlug) {
    redirect(getOrganizationSetupPath(session.user.id));
  }

  return session;
}

export async function requireOrganizationAccess(expectedSlug: string) {
  const session = await requireOrganization();

  if (session.organizationSlug !== expectedSlug) {
    redirect(`/dashboard/${session.organizationSlug}`);
  }

  return session;
}

export async function requireNoOrganization() {
  const session = await requireUser();

  if (session.organizationSlug) {
    redirect(`/dashboard/${session.organizationSlug}`);
  }

  return session;
}

export async function redirectAuthenticatedUserAwayFromGuestPages() {
  const session = await getSession();

  if (!session) {
    return;
  }

  if (session.organizationSlug) {
    redirect(`/dashboard/${session.organizationSlug}`);
  }

  redirect(getOrganizationSetupPath(session.user.id));
}
