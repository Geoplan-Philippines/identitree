import { NfcCard } from "@/lib/services/nfc-cards.service";

export async function fetchNfcCards(): Promise<NfcCard[]> {
  const res = await fetch("/api/nfc-cards", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch NFC cards");
  return res.json();
}
