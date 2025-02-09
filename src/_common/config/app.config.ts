import { APP_API_PREFIX } from '@common/constants';
import { registerAs } from '@nestjs/config';


export const appConfig = registerAs('app', () => {
  return {
    envName: process.env.NODE_ENV || 'development',
    port: Number.parseInt(process.env.PORT as unknown as string, 10) || 9095,
    prefix: APP_API_PREFIX || '/api/v1',
    isInProduction: process.env.NODE_ENV === 'production',
  };
});
