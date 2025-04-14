import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDbService } from '../../../backend/src/dynamodb'; // Import your DynamoDB service
import {
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';

const mockDynamoDBClient = {
    send: jest.fn(),
}

describe('EventService', () => {
  let service: DynamoDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamoDbService,
        {
          provide: DynamoDBClient, // Mocking the dependency
          useValue: mockDynamoDBClient,
        },
      ],
    }).compile();

    service = module.get<DynamoDbService>(DynamoDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});