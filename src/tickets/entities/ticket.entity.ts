import { BaseAbstractEntity } from "@src/base.entity";
import { Event } from "@src/events/entities/event.entity";
import { instanceToPlain } from "class-transformer";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({
  name: 'tickets'
})
export class Ticket extends BaseAbstractEntity {

  @ManyToOne(() => Event, event => event.tickets)
  event: Event;

  @Column()
  userEmail: string; // this could have been a relation to a User entity

  @Column()
  status: 'BOOKED' | 'CANCELLED' | 'WAITING'; // Can be done with type or enum

  @Column()
  position: number;

  toJSON() {
    return instanceToPlain(this);
  }
}