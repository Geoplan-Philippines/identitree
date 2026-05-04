import { Injectable, NotFoundException } from '@nestjs/common';
import { AnalyticsChannel } from '@prisma/client';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(dto: CreateAnalyticsEventDto, clientIp?: string) {
    // 1. Resolve Profile to get organizationId
    const profile = await this.prisma.profile.findUnique({
      where: { id: dto.profileId },
      select: { organizationId: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (!profile.organizationId) {
      // If schema requires organizationId to be not null, we can't save without it.
      // Alternatively, we could throw an error, but analytics failing shouldn't crash the app.
      throw new Error('Profile does not belong to an organization, cannot track analytics event');
    }

    // 2. Resolve IP and Geo-location
    let ip = dto.visitorIp || clientIp;
    let country = dto.country;
    let city = dto.city;

    if (ip && (!country || !city)) {
      const geo = await this.getLocationFromIp(ip);
      if (geo) {
        country = country || geo.country;
        city = city || geo.city;
      }
    }

    // 3. Save the event
    return this.prisma.analyticsEvent.create({
      data: {
        organizationId: profile.organizationId,
        profileId: dto.profileId,
        nfcCardId: dto.nfcCardId,
        eventType: dto.eventType,
        channel: dto.channel,
        visitorIp: ip,
        country: country,
        city: city,
      },
    });
  }

  async getStatsBySlug(
    slug: string, 
    filters: { 
      from?: string; 
      to?: string; 
      profileId?: string; 
      channel?: AnalyticsChannel 
    } = {}
  ) {
    const org = await this.prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    const endDate = filters.to ? new Date(filters.to) : new Date();
    const startDate = filters.from ? new Date(filters.from) : new Date();
    
    if (!filters.from) {
      startDate.setUTCDate(endDate.getUTCDate() - 30);
    }

    // Adjust boundaries to cover the entire start and end days in UTC
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const where: any = {
      organizationId: org.id,
      occurredAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (filters.profileId) {
      where.profileId = filters.profileId;
    }

    if (filters.channel) {
      where.channel = filters.channel;
    }

    const events = await this.prisma.analyticsEvent.findMany({
      where,
      select: {
        eventType: true,
        channel: true,
        occurredAt: true,
      },
      orderBy: {
        occurredAt: 'asc',
      },
    });

    // Process events into daily stats
    const statsMap = new Map<string, { 
      date: string; 
      views: number; 
      saves: number;
      nfc: number;
      qr: number;
      direct: number;
    }>();

    // Initialize the range
    const current = new Date(startDate);
    current.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    while (current.getTime() <= end.getTime()) {
      const dateKey = current.toISOString().split('T')[0];
      statsMap.set(dateKey, { 
        date: dateKey, 
        views: 0, 
        saves: 0,
        nfc: 0,
        qr: 0,
        direct: 0,
      });
      current.setUTCDate(current.getUTCDate() + 1);
    }

    events.forEach((event) => {
      const dateKey = event.occurredAt.toISOString().split('T')[0];
      const dayStat = statsMap.get(dateKey);
      if (dayStat) {
        if (event.eventType === 'PROFILE_VIEW') {
          dayStat.views++;
        } else if (event.eventType === 'SAVE_CONTACT') {
          dayStat.saves++;
        }

        if (event.channel === 'NFC_TAP') {
          dayStat.nfc++;
        } else if (event.channel === 'QR_SCAN') {
          dayStat.qr++;
        } else if (event.channel === 'DIRECT_LINK') {
          dayStat.direct++;
        }
      }
    });

    return Array.from(statsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }


  private async getLocationFromIp(ip: string): Promise<{ country: string; city: string } | null> {
    if (!ip || ip === '127.0.0.1' || ip === '::1') return null;
    try {
      // Using ip-api for simple free geo-location without API key
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await response.json();
      if (data.status === 'success') {
        return {
          country: data.country,
          city: data.city,
        };
      }
    } catch (error) {
      // Ignore errors so analytics don't fail if geo API is down
      console.warn(`Failed to get geo location for IP: ${ip}`, error);
    }
    return null;
  }
}
