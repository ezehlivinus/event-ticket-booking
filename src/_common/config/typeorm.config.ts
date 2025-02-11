import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config({
  path: '.env.development',
});

const configService = new ConfigService({
  envFilePath: ['.env.development'],
});

// console.log(configService.get('DB_HOST'));

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: false,
});
