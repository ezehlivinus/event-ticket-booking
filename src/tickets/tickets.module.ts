import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { TicketsService } from './tickets.service';
import { EventsModule } from '@src/events/events.module';
import { TicketsController } from './tickets.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 10,
      },
    ]),
    EventsModule
  ],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
