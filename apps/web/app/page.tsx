import Link from "next/link";
import { Metadata } from "next";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Identitree — Identity & Organization Workspace",

  description: "Manage users, organizations, and secure NFC access in one place. The ultimate digital business card ecosystem for teams.",
  alternates: {
    canonical: "https://identitree.geoplanph.com",
  },
};


export default async function RootPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center">
      {/* Site Name Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Identitree",
              alternateName: ["Identitree Geoplan", "Identitree PH"],
              url: "https://identitree.geoplanph.com",
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Identitree",
              url: "https://identitree.geoplanph.com",
              logo: "https://res.cloudinary.com/djfuei11u/image/upload/v1778116399/icon_tnotpl.png",
            },
          ]),
        }}
      />


      <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Identitree
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
        Identity and organization workspace for your team.
      </h1>
      <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
        Manage users, organizations, and secure access in one place. Start by
        creating an account or signing in to continue.
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
        >
          Create account
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-accent"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
