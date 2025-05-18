import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDbService } from '../../../backend/src/dynamodb'; // Import your DynamoDB service
import {
  DynamoDBClient,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';

const mockDynamoDBClient = {
  send: jest.fn(),
}

const scanTableReturn = {
  Items: [
    {
      eventId: { S: '1' },
      event_name: { S: 'Youth Pride Celebration' },
      description: { S: 'Pride celebration for youth ages 14-18' },
      date: { S: '2024-09-15T08:30:25' },
      host_name: { S: 'Sam' },
      location: {
        M: {
          street: { S: '360 Winter Street' },
          city: { S: 'Waltham' },
          state: { S: 'MA' },
          zipCode: { S: '02451' },
          country: { S: 'United States' },
        },
      },
      website: { S: 'https://google.com' },
      registration_link: { S: 'https://google.com' },
      phone_number: { S: '000-000-0000' },
      picture: {
        L: [{ S: '' }, { S: '' }, { S: '' }],
      },
    },
  ]
};


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

  afterEach(() => {
    jest.clearAllMocks(); // clears mock call history, return values, etc.
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scanTable', () => {
    it('should scan a table successfully with a table name', async () => {

      mockDynamoDBClient.send.mockResolvedValue(scanTableReturn);

      const response = await service.scanTable('shelterlinkEvents');
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(ScanCommand);
      expect(call.input).toEqual({ TableName: 'shelterlinkEvents' });

      expect(response).toStrictEqual(scanTableReturn.Items);
    });
  });

  describe('getHighestId', () => {
    it('should return the highest ID from the table', async () => {
      mockDynamoDBClient.send.mockResolvedValue(scanTableReturn);

      const response = await service.getHighestId('shelterlinkEvents', 'eventId');
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(ScanCommand);
      expect(call.input).toEqual({ TableName: 'shelterlinkEvents', ProjectionExpression: 'eventId' });

      expect(response).toEqual(1); // Assuming the highest ID is 1 in the mock data
    });
  });

});