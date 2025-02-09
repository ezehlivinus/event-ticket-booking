import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  options: {
    issuer: 'event-tickets',
    audience: 'event-tickets.com',
    subject: 'event-tickets:user',
    expiresIn: process.env.NODE_ENV !== 'development' ? '6h' : '1d',
    algorithm: 'HS256'
  },
  secret: process.env.JWT_SECRET
}));
