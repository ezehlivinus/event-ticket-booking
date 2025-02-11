import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
  @ApiProperty({ example: 'Event name', description: 'The name of the event', required: true, type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Event description', description: 'The description of the event', required: false, type: String })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 100, description: 'The number of available tickets', required: false, type: Number })
  @IsNotEmpty()
  @IsInt()
  availableTickets: number;
}
