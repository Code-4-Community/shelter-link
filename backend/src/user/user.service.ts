import { Injectable } from '@nestjs/common';

import { DynamoDbService } from '../dynamodb';

@Injectable()
export class UserService {
  private readonly tableName = 'shelterlinkUsers';
  constructor(private readonly dynamoDbService: DynamoDbService) {}
}
