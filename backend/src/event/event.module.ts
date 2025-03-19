import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { DynamoDbService } from '../dynamodb';

@Module({
  imports: [],
  providers: [EventService, DynamoDbService],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}
