import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFC Card Registration Guide",
  description: "Step-by-step technical guide for registering and configuring Handshakes NFC cards using NFC Tools.",
  alternates: {
    canonical: "https://identitree.geoplanph.com/docs/nfc/registration",
  },
};


export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
