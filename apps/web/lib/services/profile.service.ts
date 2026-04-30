import { apiClient } from "@/lib/api/client";

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  positionTitle: string;
  avatarUrl?: string;
};

class ProfileService {
  async getProfiles() {
    return apiClient.request<Profile[]>("/profiles");
  }
}

export const profileService = new ProfileService();
