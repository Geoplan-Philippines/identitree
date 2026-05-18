import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Identitree — Premium NFC Digital Business Cards for Teams",


  description: "Manage users, organizations, and secure NFC access in one place. The ultimate digital business card ecosystem for teams.",
  alternates: {
    canonical: "https://identitree.geoplanph.com",
  },
};


export default async function RootPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[oklch(0.18_0.06_255)] text-white">
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

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-[oklch(0.48_0.18_255)] opacity-30 blur-[120px]" />
        <div className="absolute -bottom-40 -right-24 h-[560px] w-[560px] rounded-full bg-[oklch(0.42_0.14_260)] opacity-25 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.70_0.12_250)] opacity-20 blur-[100px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent" />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-start px-6 py-16 sm:px-10 md:px-16 lg:px-20">
        <div className="max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            Identitree
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Identity and organization workspace for your team.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/65 sm:text-lg">
            Manage users, organizations, and secure access in one place. Start by
            creating an account or signing in to continue.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="flex h-11 items-center justify-center rounded-md bg-white px-6 text-[13.5px] font-medium text-[oklch(0.18_0.06_255)] transition hover:bg-white/90"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="flex h-11 items-center justify-center rounded-md border border-white/30 px-6 text-[13.5px] font-medium text-white transition hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-white/60">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              SOC2-ready workflows
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
              Multi-tenant access
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-[6%] top-1/2 hidden w-[39%] -translate-y-1/2 lg:block">
        <Image
          src="/assets/identitree%20card.png"
          alt="Identitree NFC card"
          width={1800}
          height={1200}
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="w-full max-w-none mix-blend-screen"
          priority
          unoptimized
        />
      </div>

    </main>
  );
}
