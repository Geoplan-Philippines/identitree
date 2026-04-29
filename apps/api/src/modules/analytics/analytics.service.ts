import { Injectable, NotFoundException } from '@nestjs/common';
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
