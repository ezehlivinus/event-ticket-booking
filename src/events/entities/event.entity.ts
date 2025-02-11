import { BaseAbstractEntity } from "@src/base.entity";
import { Ticket } from "@src/tickets/entities/ticket.entity";
import { instanceToPlain } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'events'
})
export class Event extends BaseAbstractEntity {

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;


  @Column({ type: 'integer', default: 1 })
  availableTickets: number;

  @OneToMany(() => Ticket, ticket => ticket.event, {
    cascade: ['insert', 'update']
  })
  tickets: Ticket[];

  toJSON() {
    return instanceToPlain(this);
  }
}
