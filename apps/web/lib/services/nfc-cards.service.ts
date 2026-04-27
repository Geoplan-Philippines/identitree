
import { apiClient } from "@/lib/api/client";

export type CreateNfcCardPayload = {
  name: string;
  cardType: "GEOPLAN_ISSUED" | "CUSTOMER_OWNED";
  hardwareId?: string;
};

export type NfcCard = {
  id: string;
  hardwareId?: string | null;
  cardType: "GEOPLAN_ISSUED" | "CUSTOMER_OWNED";
  encodedUrl: string;
  status: string;
  organizationId?: string | null;
  profileId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function createNfcCard(payload: CreateNfcCardPayload): Promise<NfcCard> {
  return apiClient.post<NfcCard>("/nfc-cards", payload);
}
