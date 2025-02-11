import { Injectable, NotFoundException } from '@nestjs/common';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateEventDto } from '@common/dtos';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  async create(event: CreateEventDto): Promise<Event> {
    return await this.eventsRepository.save(event);
  }

  async findOne(filter: FindOneOptions<Event>): Promise<Event | null> {
    return await this.eventsRepository.findOne(filter);
  }

  async findOneIfNotExistsFail(filter: FindOneOptions<Event>): Promise<Event> {
    const event = await this.findOne(filter);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }
}
