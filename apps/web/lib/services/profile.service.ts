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
  async getProfiles(headers?: HeadersInit) {
    return apiClient.get<Profile[]>("/profiles", headers);
  }
}

export const profileService = new ProfileService();
