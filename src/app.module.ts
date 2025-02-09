import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from '@common/config/app.config';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from '@common/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.production', '.env.development'],
      load: [appConfig, jwtConfig]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
