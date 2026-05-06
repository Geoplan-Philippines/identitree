import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService, Notification, NotificationType } from "@/lib/services/notification.service";
import { authClient } from "@/lib/auth-client";
import { io } from "socket.io-client";

export function useNotifications() {
  const queryClient = useQueryClient();
  const { data: sessionData } = authClient.useSession();
  const userId = sessionData?.user?.id;

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getNotifications(),
    refetchInterval: 1000 * 60, // Fallback polling every 1 minute if WS fails
    enabled: !!userId,
  });

  // Real-time WebSocket connection
  useEffect(() => {
    if (!userId) return;

    // Extract base origin from the API URL (removes /api/v1 if present)
    const fullApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
    const apiUrl = fullApiUrl.replace(/\/api\/v1\/?$/, "");

    const socket = io(`${apiUrl}/notifications`, {
      query: { userId },
      transports: ["websocket"], // Preferred for performance
    });

    socket.on("notification_received", (notification: Notification) => {
      // Refresh the list and unread count immediately in the background
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.refetchQueries({ queryKey: ["notifications"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, queryClient]);

  const markAsRead = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    // Ensure refetch happens even if invalidation is pending
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["notifications"] });
    }
  });

  const markAllAsRead = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["notifications"] });
    }
  });

  const deleteNotification = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["notifications"] });
    }
  });

  const unreadCount = query.data?.filter((n) => !n.isRead).length || 0;

  return {
    ...query,
    unreadCount,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    deleteNotification: deleteNotification.mutate,
  };
}
