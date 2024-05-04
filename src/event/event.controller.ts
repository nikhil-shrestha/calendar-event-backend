import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { EventService } from './event.service';
import { Logger } from '@nestjs/common';

@Controller('events')
export class EventController {
  private logger = new Logger('EventController');

  constructor(private eventService: EventService) {}

  @Get()
  getTasks() {
    return this.eventService.getEvents();
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<EventEntity> {
    return this.eventService.getEventById(id);
  }

  @Post()
  createTask(@Body() createEventDto: CreateEventDto): Promise<EventEntity> {
    return this.eventService.createEvent(createEventDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.eventService.deleteEvent(id);
  }

  @Patch('/:id/status')
  updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventEntity> {
    return this.eventService.updateEvent(id, updateEventDto);
  }
}
