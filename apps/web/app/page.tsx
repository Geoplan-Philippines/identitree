import { Metadata } from "next";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";
import { Landing } from "@/components/landing/landing";

export const metadata: Metadata = {
  title: "Handshakes: Premium NFC Digital Business Cards for Teams",
  description:
    "Before business cards, there were handshakes. A universal gesture of trust, modernized into a single tap. The premium NFC digital business card for teams.",
  alternates: {
    canonical: "https://identitree.geoplanph.com",
  },
};

export default async function RootPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Handshakes",
              alternateName: ["Handshakes Cards", "Handshakes Geoplan"],
              url: "https://identitree.geoplanph.com",
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Handshakes",
              url: "https://identitree.geoplanph.com",
              logo: "https://identitree.geoplanph.com/icon.png",
            },
          ]),
        }}
      />
      <Landing />
    </>
  );
}
