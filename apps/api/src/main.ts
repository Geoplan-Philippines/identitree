import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './configs/env';
// No need to import cors directly; use app.enableCors()
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: [
      env.frontendUrl,
      'https://identitree-dev.geoplanph.com',
      'https://identitree-stg.geoplanph.com',
      'https://identitree.geoplanph.com',
    ],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT || 8000);
}
void bootstrap();
