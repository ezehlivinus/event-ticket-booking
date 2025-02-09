import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { logger } from '@common/config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const port = configService.getOrThrow<number>('app.port');
  const environment = configService.getOrThrow('app.envName');
  await app.listen(port);

  logger.info(`Application server running on ${environment} environment and listening on port ${port}`);
}
bootstrap();
