import { Injectable } from '@nestjs/common';
import { Notification, NotificationType } from '@prisma/client';
import { PrismaService } from '../../shared/database/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async create(data: {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    link?: string | null;
    organizationId?: string | null;
  }): Promise<Notification> {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
        link: data.link || null,
        organizationId: data.organizationId || null,
      },
      include: {
        organization: {
          select: {
            name: true,
            logo: true,
            slug: true,
          },
        },
      },
    });

    // Emit real-time update via WebSocket
    this.gateway.sendToUser(notification.userId, notification);

    return notification;
  }

  async findAll(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        organization: {
          select: {
            name: true,
            logo: true,
            slug: true,
          },
        },
      },
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async delete(id: string, userId: string): Promise<Notification> {
    return this.prisma.notification.delete({
      where: { id, userId },
    });
  }
}
