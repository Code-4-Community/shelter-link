import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { EventService } from './event.service';
import { NewEventInput } from '../dtos/newEventDTO';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  public async postEvent(@Body() eventData: NewEventInput) {
    return await this.eventService.postEvent(eventData);
  }

  @Get()
  public async getEvents() {
    return await this.eventService.getEvents();
  }

  @Get('/:eventId')
  public async getEvent(@Param('eventId') eventId: string) {
    return await this.eventService.getEvent(eventId);
  }
}
