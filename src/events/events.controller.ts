import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { EventsService } from './events.service';
import { CreateEventDto } from '@common/dtos';

@Controller('events')
@UseGuards(ThrottlerGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService
  ) {}

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    const event = await this.eventsService.create(createEventDto);

    return { 
      message: 'Event created successfully',
      data: event
    };
  }

  // @Get('status/:id')
  // async getEventStatus(@Param('id') eventId: number) {
  //   // Implementation here
  // }
}
