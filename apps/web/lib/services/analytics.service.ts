import { apiClient } from "@/lib/api/client";

export type AnalyticsChannel = "NFC_TAP" | "QR_SCAN" | "DIRECT_LINK";
export type AnalyticsEventType = "PROFILE_VIEW" | "SAVE_CONTACT";

export type CreateAnalyticsEventPayload = {
  profileId: string;
  nfcCardId?: string;
  eventType: AnalyticsEventType;
  channel: AnalyticsChannel;
  visitorIp?: string;
  country?: string;
  city?: string;
};

class AnalyticsService {
  async trackEvent(payload: CreateAnalyticsEventPayload) {
    try {
      if (!payload.visitorIp) {
        const res = await fetch("https://ipinfo.io/json");
        if (res.ok) {
          const data = await res.json();
          payload.visitorIp = data.ip;
          payload.country = data.country;
          payload.city = data.city;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch public IP info", e);
    }

    return apiClient.request("/analytics", {
      method: "POST",
      body: payload,
    });
  }
}

export const analyticsService = new AnalyticsService();
