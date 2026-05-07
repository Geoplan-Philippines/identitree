
import { apiClient } from "@/lib/api/client";

export type CreateNfcCardPayload = {
  name: string;
  cardType: "GEOPLAN_ISSUED" | "CUSTOMER_OWNED";
  hardwareId?: string;
};

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
  positionTitle: string;
  contactNumber: string;
  linkedinUsername?: string | null;
  whatsappNumber?: string | null;
  viberNumber?: string | null;
  organizationId?: string | null;
  ownerUserId?: string | null;
  createdAt: string;
  updatedAt: string;
  organization?: {
    name: string;
    logo?: string;
    website?: string;
  } | null;
};

export type NfcCard = {
  id: string;
  hardwareId?: string | null;
  cardType: "GEOPLAN_ISSUED" | "CUSTOMER_OWNED";
  encodedUrl: string;
  status: "UNASSIGNED" | "UNACTIVATED" | "ACTIVE" | "INACTIVE" | "LOST" | "REPLACED";
  organizationId?: string | null;
  profileId?: string | null;
  profile?: Profile | null;
  createdAt: string;
  updatedAt: string;
};

export async function getNfcCards(headers?: HeadersInit): Promise<NfcCard[]> {
  return apiClient.get<NfcCard[]>("/nfc-cards", headers);
}

export async function getNfcCard(id: string): Promise<NfcCard> {
  return apiClient.get<NfcCard>(`/nfc-cards/${id}`);
}

export async function createNfcCard(payload: CreateNfcCardPayload): Promise<NfcCard> {
  return apiClient.post<NfcCard>("/nfc-cards", payload);
}

export async function updateNfcCard(id: string, payload: Partial<NfcCard>): Promise<NfcCard> {
  return apiClient.patch<NfcCard>(`/nfc-cards/${id}`, payload);
}

export async function getPublicProfile(orgSlug: string, profileSlug: string): Promise<Profile> {
  return apiClient.get<Profile>(`/profiles/${orgSlug}/${profileSlug}`);
}

export async function checkNfcCardExists(url: string): Promise<{ exists: boolean }> {
  return apiClient.get<{ exists: boolean }>(`/nfc-cards/public-exists?url=${encodeURIComponent(url)}`);
}

export async function registerCustomerCard(payload: { encodedUrl: string; hardwareId: string }): Promise<NfcCard> {
  return apiClient.post<NfcCard>("/nfc-cards/public-register-customer", payload);
}

export async function getPublicSitemapData(): Promise<{ orgSlug: string; profileSlug: string; updatedAt: string }[]> {
  return apiClient.get<{ orgSlug: string; profileSlug: string; updatedAt: string }[]>("/profiles/public-sitemap");
}
