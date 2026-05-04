import { cookies } from "next/headers";
import { getNfcCards, NfcCard } from "@/lib/services/nfc-cards.service";
import { CardsClient } from "@/components/nfc/cards-client";

export default async function CardsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let initialData: NfcCard[] = [];
  try {
    initialData = await getNfcCards({ cookie: cookieHeader });
  } catch (error) {
    console.error("Failed to fetch NFC cards on server:", error);
    // Optionally handle error state here, or let the client handle it if data is empty
  }

  return <CardsClient initialData={initialData} />;
}
