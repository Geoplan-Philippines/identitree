import { Metadata } from "next";
import { getPublicProfile } from "@/lib/services/nfc-cards.service";
import { PublicProfileClient } from "@/components/profile/public-profile-client";
import { Nfc } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PublicProfilePageProps = {
  params: Promise<{ slug: string; profileSlug: string }>;
};

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const { slug, profileSlug } = await params;
  
  try {
    const profile = await getPublicProfile(slug, profileSlug);
    const fullName = `${profile.firstName} ${profile.lastName}`;
    const title = `${fullName} | Identitree`;
    const description = `${profile.positionTitle}${profile.organization?.name ? ` at ${profile.organization.name}` : ""}. Connect with ${profile.firstName} via NFC digital business card.`;

    return {
      title,
      description,
      keywords: [
        fullName,
        profile.firstName,
        profile.lastName,
        profile.organization?.name || "",
        "NFC Digital Business Card",
        "Identitree",
        "Identitree Profile",
        `${profile.firstName} Identitree`,
        `${profile.firstName} NFC`,
      ].filter(Boolean),

      alternates: {

        canonical: `https://identitree.geoplanph.com/${slug}/${profileSlug}`,
      },
      openGraph: {
        title,
        description,
        type: "profile",
        firstName: profile.firstName,
        lastName: profile.lastName,
        images: profile.avatarUrl 
          ? [{ url: profile.avatarUrl }] 
          : [{ url: "https://res.cloudinary.com/djfuei11u/image/upload/v1778116399/icon_tnotpl.png" }],
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: profile.avatarUrl 
          ? [profile.avatarUrl] 
          : ["https://res.cloudinary.com/djfuei11u/image/upload/v1778116399/icon_tnotpl.png"],
        creator: "@geoplanph",
      }

    };
  } catch (error) {
    return {
      title: "Profile Not Found | Identitree",
    };
  }
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { slug, profileSlug } = await params;
  
  let profile = null;
  try {
    profile = await getPublicProfile(slug, profileSlug);
  } catch (error) {
    console.error("Failed to fetch public profile on server:", error);
  }

  if (!profile) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center p-6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="w-full max-w-[430px] space-y-12">
          <div className="relative aspect-[1.586/1] rounded-2xl border border-foreground/10 bg-white/80 backdrop-blur-sm p-8 flex flex-col justify-between shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]">
            <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
              <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                <Nfc className="size-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="size-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Nfc className="size-6 text-slate-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Card not found</h2>
                <p className="mt-1.5 text-sm font-medium text-slate-500 leading-relaxed">
                  The profile linked to this NFC card is either inactive or doesn't exist.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild className="font-bold px-8 h-11">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfa_44%,#eef6f2_100%)] text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: `${profile.firstName} ${profile.lastName}`,
            jobTitle: profile.positionTitle,
            worksFor: {
              "@type": "Organization",
              name: profile.organization?.name || "Independent",
              url: profile.organization?.website || undefined,
            },

            url: `https://identitree.geoplanph.com/${slug}/${profileSlug}`,
            image: profile.avatarUrl,
            description: `${profile.positionTitle}${profile.organization?.name ? ` at ${profile.organization.name}` : ""}`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://identitree.geoplanph.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: profile.organization?.name || "Profiles",
                item: `https://identitree.geoplanph.com/${slug}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `${profile.firstName} ${profile.lastName}`,
                item: `https://identitree.geoplanph.com/${slug}/${profileSlug}`,
              },
            ],
          }),
        }}
      />
      <div
        aria-hidden="true"

        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[48px_48px] mask-[linear-gradient(to_bottom,black,transparent_74%)]"
      />
      <PublicProfileClient profile={profile} />
    </main>
  );
}
