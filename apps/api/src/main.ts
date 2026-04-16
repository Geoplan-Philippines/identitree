import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './configs/env';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(cors({
    origin: [
      env.frontendUrl,
      'https://identitree-dev.geoplanph.com',
      'https://identitree-stg.geoplanph.com',
      'https://identitree.geoplanph.com',
    ],
    credentials: true,
  }));

  await app.listen(process.env.PORT || 8000);
}
void bootstrap();
