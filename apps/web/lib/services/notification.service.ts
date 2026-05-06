import { apiClient } from "@/lib/api/client";

export type NotificationType = 
  | "INFO" 
  | "SUCCESS" 
  | "WARNING" 
  | "ERROR" 
  | "BILLING" 
  | "MEMBER_ACTIVITY" 
  | "SYSTEM";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  link: string | null;
  isRead: boolean;
  organizationId: string | null;
  organization?: {
    name: string;
    logo: string | null;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
};

class NotificationService {
  async getNotifications() {
    return apiClient.request<Notification[]>("/notifications");
  }

  async markAsRead(id: string) {
    return apiClient.request<Notification>(`/notifications/${id}/read`, {
      method: "PATCH",
    });
  }

  async markAllAsRead() {
    return apiClient.request<void>("/notifications/read-all", {
      method: "PATCH",
    });
  }

  async deleteNotification(id: string) {
    return apiClient.request<void>(`/notifications/${id}`, {
      method: "DELETE",
    });
  }
}

export const notificationService = new NotificationService();
