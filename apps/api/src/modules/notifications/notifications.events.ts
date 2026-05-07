import { EventEmitter } from 'events';

export const notificationEvents = new EventEmitter();

export const NOTIFICATION_CREATED_EVENT = 'notification.created';

export interface NotificationCreatedPayload {
  userId: string;
  notification: any;
}
