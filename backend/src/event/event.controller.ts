import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  NotFoundException,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  public async getEvents() {
    return this.eventService.getEvents();
  }

  @Get('/:id')
  public async getEvent(@Param('id') id: string) {
    return this.eventService.getEvent(id);
  }
}