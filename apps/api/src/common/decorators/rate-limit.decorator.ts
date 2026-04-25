import { Module } from '@nestjs/common';
import { ThrottlerModule, Throttle } from '@nestjs/throttler';

/**
 * Custom RateLimit decorator that wraps NestJS Throttle.
 * @param limit Number of requests allowed
 * @param ttl Time to live in milliseconds
 */
export const RateLimit = (limit: number, ttl: number) => {
  return Throttle({ default: { limit, ttl } });
};

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        { ttl: 60, limit: 5 },
      ],
    }),
  ],
  exports: [ThrottlerModule],
})
export class RateLimitModule {}
