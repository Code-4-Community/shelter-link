import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../../../backend/src/event/event.service';
import { DynamoDbService } from '../../../backend/src/dynamodb'; // Import your DynamoDB service
import { NewEventInput } from 'backend/src/dtos/newEventDTO';

const mockDynamoDB = {
  scanTable: jest.fn(),
  getHighestShelterId: jest.fn(),
  postItem: jest.fn(),
  getItem: jest.fn(),
  deleteItem: jest.fn(),
  updateAttributes: jest.fn(),
};

const postReqSuccess: NewEventInput = {
  event_name: 'Youth Pride Celebration',
  description: 'Pride celebration for youth ages 14-18',
  date: '???',
  host_name: 'Sam',
  location: {
    street: '360 Winter street',
    city: 'Waltham',
    state: 'Massachusetts',
    zipCode: '02451',
    country: 'United States',
  },
  website: 'https://google.com',
  registration_link: 'https://google.com',
  phone_number: '000-000-0000',
  picture: ['', '', ''],
};

const postDynamoDBReqBodySuccess = {
  eventId: { S: '1' },
  event_name: { S: postReqSuccess.event_name },
  date: { S: postReqSuccess.date },
  host_name: { S: postReqSuccess.host_name },
  location: {
    M: {
      street: { S: postReqSuccess.location.street },
      city: { S: postReqSuccess.location.city },
      state: { S: postReqSuccess.location.state },
      zipCode: { S: postReqSuccess.location.zipCode },
      country: { S: postReqSuccess.location.country },
    },
  },
  website: { S: postReqSuccess.website },
  registration_link: { S: postReqSuccess.registration_link },
  phone_number: { S: postReqSuccess.phone_number },
  picture: {
    L: [{ S: '' }, { S: '' }, { S: '' }],
  },
};

const postReturnSuccess = {
  $metadata: {
    httpStatusCode: 200,
    requestId: '18I3TTSM5018GTL29UV9O48VENVV4KQNSO5AEMVJF66Q9ASUAAJG',
    attempts: 1,
    totalRetryDelay: 0,
  },
  id: 1,
};

const getEventReqSuccess = {
  eventId: '1',
  event_name: 'Youth Pride Celebration',
  description: 'Pride celebration for youth ages 14-18',
  date: '???',
  host_name: 'Sam',
  location: {
    street: '360 Winter street',
    city: 'Waltham',
    state: 'Massachusetts',
    zipCode: '02451',
    country: 'United States',
  },
  website: 'https://google.com',
  registration_link: 'https://google.com',
  phone_number: '000-000-0000',
  picture: ['', '', ''],
};

const getEventReqSuccessDynamoDB = [{
  eventId: { S: '1' },
  event_name: { S: postReqSuccess.event_name },
  date: { S: postReqSuccess.date },
  host_name: { S: postReqSuccess.host_name },
  location: {
    M: {
      street: { S: postReqSuccess.location.street },
      city: { S: postReqSuccess.location.city },
      state: { S: postReqSuccess.location.state },
      zipCode: { S: postReqSuccess.location.zipCode },
      country: { S: postReqSuccess.location.country },
    },
  },
  website: { S: postReqSuccess.website },
  registration_link: { S: postReqSuccess.registration_link },
  phone_number: { S: postReqSuccess.phone_number },
  picture: {
    L: [{ S: '' }, { S: '' }, { S: '' }],
  },
}];

const getEventsReqSuccess = [
  {
    eventId: '1',
    event_name: 'Youth Pride Celebration',
    description: 'Pride celebration for youth ages 14-18',
    date: '???',
    host_name: 'Sam',
    location: {
      street: '360 Winter street',
      city: 'Waltham',
      state: 'Massachusetts',
      zipCode: '02451',
      country: 'United States',
    },
    website: 'https://google.com',
    registration_link: 'https://google.com',
    phone_number: '000-000-0000',
    picture: ['', '', ''],
  },
  {
    eventId: '2',
    event_name: 'Youth Pride Celebration',
    description: 'Pride celebration for youth ages 14-18',
    date: '???',
    host_name: 'Sam',
    location: {
      street: '360 Winter street',
      city: 'Waltham',
      state: 'Massachusetts',
      zipCode: '02451',
      country: 'United States',
    },
    website: 'https://google.com',
    registration_link: 'https://google.com',
    phone_number: '000-000-0000',
    picture: ['', '', ''],
  },
];

const getEventsReqSuccessDynamoDB = [
  {
    eventId: { S: '1' },
    event_name: { S: postReqSuccess.event_name },
    date: { S: postReqSuccess.date },
    host_name: { S: postReqSuccess.host_name },
    location: {
      M: {
        street: { S: postReqSuccess.location.street },
        city: { S: postReqSuccess.location.city },
        state: { S: postReqSuccess.location.state },
        zipCode: { S: postReqSuccess.location.zipCode },
        country: { S: postReqSuccess.location.country },
      },
    },
    website: { S: postReqSuccess.website },
    registration_link: { S: postReqSuccess.registration_link },
    phone_number: { S: postReqSuccess.phone_number },
    picture: {
      L: [{ S: '' }, { S: '' }, { S: '' }],
    },
  },
  {
    eventId: { S: '2' },
    event_name: { S: postReqSuccess.event_name },
    date: { S: postReqSuccess.date },
    host_name: { S: postReqSuccess.host_name },
    location: {
      M: {
        street: { S: postReqSuccess.location.street },
        city: { S: postReqSuccess.location.city },
        state: { S: postReqSuccess.location.state },
        zipCode: { S: postReqSuccess.location.zipCode },
        country: { S: postReqSuccess.location.country },
      },
    },
    website: { S: postReqSuccess.website },
    registration_link: { S: postReqSuccess.registration_link },
    phone_number: { S: postReqSuccess.phone_number },
    picture: {
      L: [{ S: '' }, { S: '' }, { S: '' }],
    },
  },
];

describe('ShelterService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: DynamoDbService, // Mocking the dependency
          useValue: mockDynamoDB,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('postEvent', () => {
    it('should successfully post an event', async () => {
      mockDynamoDB.getHighestShelterId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postEvent(postReqSuccess);

      expect(mockDynamoDB.getHighestShelterId).toHaveBeenCalledWith(
        'shelterlinkShelters'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodySuccess
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should correctly fail if dynamoDB returns an error for getHighestId', async () => {
      mockDynamoDB.getHighestShelterId.mockRejectedValue(
        new Error('highest shelter id error')
      );
      await expect(service.postEvent(postReqSuccess)).rejects.toThrow(
        'highest shelter id error'
      );
      expect(mockDynamoDB.getHighestShelterId).toHaveBeenCalledWith(
        'shelterlinkShelters'
      );
    });

    it('should correctly fail if dynamoDB returns an error for postItem', async () => {
      mockDynamoDB.getHighestShelterId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockRejectedValue(
        new Error('dynamodb post item error')
      );
      await expect(service.postEvent(postReqSuccess)).rejects.toThrow(
        'dynamodb post item error'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodySuccess
      );
    });
  });

  describe('getEvents', () => {
    it('should successfully get events', async () => {
      mockDynamoDB.scanTable.mockResolvedValue(getEventsReqSuccessDynamoDB);

      const response = await service.getEvents();
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith('shelterlinkEvents');
      expect(response).toStrictEqual(getEventsReqSuccess);
    });

    it('should correctly fail if DynamoDB returns an error for scanTable', async () => {
      mockDynamoDB.scanTable.mockRejectedValue(
        new Error('dynamodb scanTable error')
      );
      await expect(service.getEvents()).rejects.toThrow(
        'dynamodb scanTable error'
      );
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkShelters'
      );
    });
  });

  describe('getEvent', () => {
    it('should successfully get an event', async () => {
      mockDynamoDB.scanTable.mockResolvedValue(getEventReqSuccessDynamoDB);

      const response = await service.getEvent('6');
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId = :eventId',
        { ':eventId': { S: '6' } }
      );
      expect(response).toStrictEqual(getEventReqSuccess);
    });

    it('should correctly fail if DynamoDB returns an error for scanTable', async () => {
      mockDynamoDB.scanTable.mockRejectedValue(
        new Error('dynamodb scanTable error')
      );
      await expect(service.getEvent('6')).rejects.toThrow(
        'Unable to get shelter: Error: dynamodb scanTable error'
      );
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId = :shelterId',
        { ':shelterId': { S: '6' } }
      );
    });
  });
});
