import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);

  const appPrefix = configService.get('app.prefix');

  const docsPrefix = `${appPrefix}/docs`;

  const config = new DocumentBuilder()
    .setTitle('Event Management')
    .setDescription('Api Documentation for Event Management')
    .setVersion('1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docsPrefix, app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });
}
