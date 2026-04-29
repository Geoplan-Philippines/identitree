import { Body, Controller, Ip, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  async trackEvent(
    @Body() createAnalyticsEventDto: CreateAnalyticsEventDto,
    @Ip() ip: string,
  ) {
    // Try to save event, if it fails because of missing organizationId etc, we don't necessarily want to crash the frontend.
    // However, sending a normal error response is standard for APIs so they can debug.
    try {
      const event = await this.analyticsService.createEvent(createAnalyticsEventDto, ip);
      return { success: true, data: event };
    } catch (error) {
      // Return 400 or just success:false based on preference.
      // We'll throw the error directly which Nest will map to 500/404 based on the exception type.
      throw error;
    }
  }
}
