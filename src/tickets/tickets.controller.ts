import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TicketsService } from './tickets.service';
import { BookTicketDto } from '@common/dtos';

@Controller('tickets')
@UseGuards(ThrottlerGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('book')
  async bookTicket(@Body() dto: BookTicketDto) {
    const newTicket = await this.ticketsService.bookTicket(dto);

    return { 
      message: 'Ticket booked successfully',
      data: newTicket
    };
  }

  @Post('cancel')
  async cancelTicket(@Body() dto: { ticketId: string }) {
    const ticket = await this.ticketsService.cancelTicket(dto.ticketId);

    return {
      message: 'Ticket cancelled successfully',
      data: ticket
    };
  }
}
