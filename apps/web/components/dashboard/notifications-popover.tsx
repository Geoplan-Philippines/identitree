"use client";

import { Bell, Check, Trash2, Info, CheckCircle2, AlertTriangle, XCircle, CreditCard, Users, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationType } from "@/lib/services/notification.service";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const NOTIFICATION_ICONS: Record<NotificationType, any> = {
  INFO: Info,
  SUCCESS: CheckCircle2,
  WARNING: AlertTriangle,
  ERROR: XCircle,
  BILLING: CreditCard,
  MEMBER_ACTIVITY: Users,
  SYSTEM: ShieldAlert,
};

const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  INFO: "text-blue-500",
  SUCCESS: "text-emerald-500",
  WARNING: "text-amber-500",
  ERROR: "text-red-500",
  BILLING: "text-purple-500",
  MEMBER_ACTIVITY: "text-orange-500",
  SYSTEM: "text-slate-500",
};

export function NotificationsPopover() {
  const { 
    data: notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    isLoading 
  } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8 rounded-md hover:bg-muted"
        >
          <Bell className="size-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-red-500"></span>
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[calc(100vw-2rem)] sm:w-96 p-0 overflow-hidden" 
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 bg-muted/30">
          <div className="flex items-center gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="default" className="h-4 px-1 text-[9px] font-bold">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 text-[10px] font-medium text-primary hover:bg-transparent hover:underline"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[450px] max-h-[60vh]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center p-8 text-xs text-muted-foreground italic">
              Loading...
            </div>
          ) : !notifications || notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="size-10 rounded-full bg-muted flex items-center justify-center mb-3">
                <Bell className="size-5 text-muted-foreground/50" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => {
                const Icon = NOTIFICATION_ICONS[notification.type] || Info;
                const colorClass = NOTIFICATION_COLORS[notification.type] || "text-foreground";

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative flex gap-4 p-4 transition-colors hover:bg-muted/40",
                      !notification.isRead && "bg-primary/5 border-l-2 border-primary"
                    )}
                  >
                    <div className={cn("mt-1 shrink-0", colorClass)}>
                      <Icon className="size-5" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className={cn(
                          "text-[13px] leading-tight font-semibold truncate",
                          !notification.isRead ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground whitespace-nowrap pt-0.5 shrink-0">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <p className="text-[12px] text-muted-foreground leading-normal pr-4">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-4">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-[11px] font-bold text-primary hover:bg-transparent hover:underline"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                        <button
                          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 -mr-1.5 text-destructive hover:bg-destructive/10 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
        <Separator />
        <div className="p-2 bg-muted/10">
          <Button variant="ghost" className="w-full h-8 text-[11px] font-medium text-muted-foreground hover:text-foreground" disabled>
            View all activity
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
