
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
  templateId?: string | null;
  template?: Template | null;
};

export type Template = {
  id: string;
  name: string;
  category?: string | null;
  layoutKey: string;
  config?: TemplateConfig | null;
  availability: "GLOBAL" | "ORG_ONLY";
  organizationId?: string | null;
};

export type TemplateConfig = {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  backgroundType?: "solid" | "gradient" | "image";
  backgroundGradient?: string;
  accentColor?: string;
  textColor?: string;
  cardStyle?: string;
  buttonStyle?: "sharp" | "rounded" | "pill";
  avatarStyle?: "square" | "circle" | "rounded";
  glassmorphism?: boolean;
  shadowIntensity?: "none" | "low" | "medium" | "high";
  sectionsOrder?: string[];
  avatarAlignment?: "left" | "center" | "right";
  infoAlignment?: "left" | "center" | "right";
  socialsLayout?: "grid" | "list";
  socialsAlignment?: "left" | "center" | "right";
  actionsAlignment?: "left" | "center" | "right";
  primaryButtonColor?: string;
  primaryButtonTextColor?: string;
  secondaryButtonColor?: string;
  secondaryButtonTextColor?: string;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  bioAlignment?: "left" | "center" | "right";
  cardPrimaryColor?: string;
  cardSecondaryColor?: string;
  cardTextColor?: string;
  cardLayoutKey?: string;
  cardPattern?: "none" | "dots" | "grid" | "diagonal" | "waves";
  cardBackgroundImage?: string;
  pagePattern?: "none" | "dots" | "grid" | "diagonal" | "waves";
  cardLogoAlignment?: "left" | "right" | "center";
  cardNameAlignment?: "left" | "right" | "center";
  cardShowPattern?: boolean;
  cardShowEmail?: boolean;
  cardShowPhone?: boolean;
  cardDetailsAlignment?: "left" | "right" | "center";
  showSocialLabels?: boolean;
  socialsIconColor?: string;
  socialsButtonColor?: string;
  socialsFillColor?: string;
  headerStyle?: "minimal" | "standard" | "grand";
  showAvatar?: boolean;
  showHeader?: boolean;
  showBio?: boolean;
  showSocials?: boolean;
  showActions?: boolean;
  showFooter?: boolean;
  bioText?: string;
  headerImage?: string;
  contentSpacing?: "compact" | "relaxed" | "loose";
  showQrCode?: boolean;
  showSocialLinks?: boolean;
  showVCard?: boolean;
  showVerifyBadge?: boolean;
  fontFamily?: string;
  backgroundImage?: string;
  topBadgeText?: string;
  verifyBadgeText?: string;
  showTopBadge?: boolean;
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

export async function getTemplates(headers?: HeadersInit): Promise<Template[]> {
  return apiClient.get<Template[]>("/templates", headers);
}

export async function getTemplate(id: string, headers?: HeadersInit): Promise<Template> {
  return apiClient.get<Template>(`/templates/${id}`, headers);
}

export async function getPublicSitemapData(): Promise<{ orgSlug: string; profileSlug: string; updatedAt: string }[]> {
  return apiClient.get<{ orgSlug: string; profileSlug: string; updatedAt: string }[]>("/profiles/public-sitemap");
}
