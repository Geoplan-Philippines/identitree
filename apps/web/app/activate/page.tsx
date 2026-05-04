import { Metadata } from "next";
import { ActivateClient } from "@/components/nfc/activate-client";

export const metadata: Metadata = {
  title: "Activate Your NFC Card | Identitree",
  description: "Link your personal NFC card to your digital profile.",
};

export default function ActivatePage() {
  return <ActivateClient />;
}
