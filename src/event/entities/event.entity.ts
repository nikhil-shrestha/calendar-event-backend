import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'event',
})
export class EventEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp with time zone' })
  startDateTime: Date;

  @Column({ type: 'timestamp with time zone' })
  endDateTime: Date;

  @Column('simple-array', { nullable: true })
  @Exclude({ toPlainOnly: true })
  participants: string[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  constructor(data?: Partial<EventEntity>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
