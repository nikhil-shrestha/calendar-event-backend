import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  private eventRepository;

  private logger = new Logger();

  constructor(private dataSource: DataSource) {
    // get users table repository to interact with the database
    this.eventRepository = this.dataSource.getRepository(EventEntity);
  }

  getEvents() {
    return this.eventRepository.createQueryBuilder('event').getMany();
  }

  async getEventById(id: string): Promise<EventEntity> {
    this.logger.log(`Fetching event with ID "${id}"`);
    return this.eventRepository
      .createQueryBuilder()
      .select('event')
      .from(EventEntity, 'event')
      .where('event.id = :id', { id })
      .getOne();
  }

  async createEvent(createEventDto: CreateEventDto): Promise<EventEntity> {
    const { startDateTime, endDateTime } = createEventDto;
    try {
      const conflicts = await this.eventRepository
        .createQueryBuilder('event')
        .where(
          '(:startDateTime BETWEEN event.startDateTime AND event.endDateTime)',
          { startDateTime },
        )
        .orWhere(
          '(:endDateTime BETWEEN event.startDateTime AND event.endDateTime)',
          { endDateTime },
        )
        .getMany();

      if (conflicts.length > 0) {
        throw new Error('Scheduling conflict with existing event(s)');
      }

      const event = await this.eventRepository.create(createEventDto);
      return await this.eventRepository.save(event);
    } catch (err) {
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }

  async deleteEvent(id: string): Promise<void> {
    const result = await this.eventRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<EventEntity> {
    const event = await this.getEventById(id);

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    this.logger.log(`Updating event with ID "${id}"`);

    const { title, description, startDateTime, endDateTime, participants } =
      updateEventDto;

    const updated = await this.eventRepository
      .createQueryBuilder()
      .update(EventEntity)
      .set({
        title,
        description,
        startDateTime,
        endDateTime,
        participants,
      })
      .where('id = :id', { id })
      .execute();

    return updated;
  }

  async getEventsByStartDate(
    startDate: Date,
    endDate: Date,
  ): Promise<EventEntity[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where('event.startDateTime >= :startDate', { startDate }) // Events starting on or after the start datetime
      .andWhere('event.startDateTime < :endDate', { endDate }) // Events starting before the end datetime
      .getMany();
  }
}
