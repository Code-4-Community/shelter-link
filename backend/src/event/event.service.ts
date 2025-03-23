import { Injectable } from '@nestjs/common';
import { DynamoDbService } from '../dynamodb';

@Injectable()
export class EventService {
  private readonly tableName = 'shelterlinkEvents';
  constructor(private readonly dynamoDbService: DynamoDbService) {}
}
