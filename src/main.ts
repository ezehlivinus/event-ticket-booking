import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { logger, setupSwagger } from '@common/config';
import { HttpExceptionFilter } from '@common/filters/error.filter';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  
  const appPrefix = configService.get('app.prefix');

  app.setGlobalPrefix(appPrefix, {
    exclude: ['/']
  });


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      whitelist: true
    })
  );

  setupSwagger(app);
  const port = configService.getOrThrow<number>('app.port');
  const environment = configService.getOrThrow('app.envName');
  await app.listen(port);

  logger.info(`Application server running on ${environment} environment and listening on port ${port}`);
}
bootstrap();
