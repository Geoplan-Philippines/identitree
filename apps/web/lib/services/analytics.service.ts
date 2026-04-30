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

  async getStats(slug: string, filters: { from?: string; to?: string; profileId?: string; channel?: AnalyticsChannel } = {}) {
    const params = new URLSearchParams();
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);
    if (filters.profileId) params.append("profileId", filters.profileId);
    if (filters.channel) params.append("channel", filters.channel);

    const queryString = params.toString();
    const url = `/analytics/stats/${slug}${queryString ? `?${queryString}` : ""}`;

    return apiClient.request<{ 
      date: string; 
      views: number; 
      saves: number;
      nfc: number;
      qr: number;
      direct: number;
    }[]>(url);
  }
}

export const analyticsService = new AnalyticsService();
