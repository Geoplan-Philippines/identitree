import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './configs/env';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Trust proxy for Better Auth cookies behind Traefik
  app.getHttpAdapter().getInstance().set('trust proxy', true);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      env.authUrl,
      env.frontendUrl,
      'http://localhost:3000',
      'https://identitree-stg.geoplanph.com'
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'x-better-auth-session-token',
      'x-requested-with'
    ],
    credentials: true,
  });

  // app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT || 8000, "0.0.0.0");
}
void bootstrap();
