import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
  ],
  providers: [EventsService],
  exports: [EventsService],
  controllers: [EventsController]
})
export class EventsModule {}
