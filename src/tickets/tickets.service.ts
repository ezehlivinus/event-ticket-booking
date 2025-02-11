import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { EventsService } from '@src/events/events.service';
import { BookTicketDto } from '@common/dtos';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    private readonly eventsService: EventsService,
    private readonly dataSource: DataSource
  ) {}

  async bookTicket(dto: BookTicketDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get current ticket count
      const bookedCount = await this.ticketsRepository.count({
        where: { 
          event: { id: dto.eventId },
          status: 'BOOKED'
        },
      });

      // Get event details (would come from event service in real app)
      const event = await this.eventsService.findOneIfNotExistsFail({ where: { id: dto.eventId } });

      if (bookedCount < event.availableTickets) {
        // Create new ticket booking
        const ticket = this.ticketsRepository.create({
          event: event,
          userEmail: dto.userEmail,
          status: 'BOOKED',
          position: bookedCount + 1,
        });

        await this.ticketsRepository.save(ticket);
        await queryRunner.commitTransaction();
        
        return { 
          message: 'Ticket booked successfully',
          ticket
        };
      } else {
        // Add to waiting list
        const waitingCount = await this.ticketsRepository.count({
          where: { 
            event: { id: event.id },
            status: 'WAITING'
          },
        });

        const ticket = this.ticketsRepository.create({
          event: event,
          userEmail: dto.userEmail,
          status: 'WAITING',
          position: waitingCount + 1,
        });

        await this.ticketsRepository.save(ticket);
        await queryRunner.commitTransaction();

        return {
          message: 'Added to waiting list',
          ticket
        };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelTicket(ticketId: string) {
    const ticket = await this.ticketsRepository.findOneOrFail({ where: { id: ticketId } });

    if (ticket.status === 'CANCELLED') {
      throw new Error('Ticket already cancelled');
    }

    ticket.status = 'CANCELLED';
    await this.ticketsRepository.save(ticket);

    return {
      message: 'Ticket cancelled successfully',
      ticket
    };
  }

}
