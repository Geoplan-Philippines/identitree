import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFC Card Registration Guide",
  description: "Step-by-step technical guide for registering and configuring Identitree NFC cards using NFC Tools.",
};

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
