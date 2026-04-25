import { Controller, Get } from '@nestjs/common';
import { RateLimit } from './common/decorators/rate-limit.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Overriding the global rate limit using your custom decorator
  // Limit to 2 requests per 10 seconds (10000 ms)
  @RateLimit(20, 60000)
  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
