import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config({
  override: true,
});

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const frontendOrigins = process.env.FRONTEND_ORIGIN;

  console.log('Configurando CORS con origen:', frontendOrigins);
  
  app.enableCors({
    origin: frontendOrigins
      ? frontendOrigins.split(',').map((origin) => origin.trim())
      : true,
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
