import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { notificationEvents, NOTIFICATION_CREATED_EVENT, NotificationCreatedPayload } from './notifications.events';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    // Listen for events from outside the NestJS context (like auth.ts)
    notificationEvents.on(NOTIFICATION_CREATED_EVENT, (payload: NotificationCreatedPayload) => {
      this.sendToUser(payload.userId, payload.notification);
    });
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(`user_${userId}`);
    }
  }

  sendToUser(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('notification_received', notification);
  }
}
