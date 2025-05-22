import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../../../backend/src/event/event.service';
import { DynamoDbService } from '../../../backend/src/dynamodb'; // Import your DynamoDB service
import { NewEventInput } from 'backend/src/dtos/newEventDTO';

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const postReqSuccess: NewEventInput = {
  event_name: 'Youth Pride Celebration',
  description: 'Pride celebration for youth ages 14-18',
  date: '2024-09-15T08:30:25',
  host_name: 'Sam',
  location: {
    street: '360 Winter Street',
    city: 'Waltham',
    state: 'MA',
    zipCode: '02451',
    country: 'United States',
  },
  website: 'https://google.com',
  registration_link: 'https://google.com',
  phone_number: '000-000-0000',
  picture: ['', '', ''],
};

const postReqSuccessNoHostName: NewEventInput = {
  event_name: postReqSuccess.event_name,
  description: postReqSuccess.description,
  date: postReqSuccess.date,
  location: postReqSuccess.location,
  website: postReqSuccess.website,
  registration_link: postReqSuccess.registration_link,
  phone_number: postReqSuccess.phone_number,
  picture: postReqSuccess.picture,
};

const postReqSuccessNoLocation: NewEventInput = {
  event_name: postReqSuccess.event_name,
  description: postReqSuccess.description,
  date: postReqSuccess.date,
  host_name: postReqSuccess.host_name,
  website: postReqSuccess.website,
  registration_link: postReqSuccess.registration_link,
  phone_number: postReqSuccess.phone_number,
  picture: postReqSuccess.picture,
};

const postReqSuccessNoCountry: NewEventInput = {
  event_name: postReqSuccess.event_name,
  description: postReqSuccess.description,
  date: postReqSuccess.date,
  location: {
    street: postReqSuccess.location.street,
    city: postReqSuccess.location.city,
    state: postReqSuccess.location.state,
    zipCode: postReqSuccess.location.zipCode,
  },
  host_name: postReqSuccess.host_name,
  website: postReqSuccess.website,
  registration_link: postReqSuccess.registration_link,
  phone_number: postReqSuccess.phone_number,
  picture: postReqSuccess.picture,
};

const postReqSuccessNoWebsite: NewEventInput = {
  event_name: postReqSuccess.event_name,
  description: postReqSuccess.description,
  date: postReqSuccess.date,
  host_name: postReqSuccess.host_name,
  location: postReqSuccess.location,
  registration_link: postReqSuccess.registration_link,
  phone_number: postReqSuccess.phone_number,
  picture: postReqSuccess.picture,
};

const postReqSuccessNoRegistrationLink: NewEventInput = {
  event_name: postReqSuccess.event_name,
  description: postReqSuccess.description,
  website: postReqSuccess.website,
  date: postReqSuccess.date,
  host_name: postReqSuccess.host_name,
  location: postReqSuccess.location,
  phone_number: postReqSuccess.phone_number,
  picture: postReqSuccess.picture,
};

const postReqSuccessNoPhoneNumber: NewEventInput = {
  event_name: postReqSuccess.event_name,
  description: postReqSuccess.description,
  website: postReqSuccess.website,
  date: postReqSuccess.date,
  host_name: postReqSuccess.host_name,
  location: postReqSuccess.location,
  registration_link: postReqSuccess.registration_link,
  picture: postReqSuccess.picture,
};

const postReqSuccessNoPicture: NewEventInput = {
  event_name: postReqSuccess.event_name,
  description: postReqSuccess.description,
  date: postReqSuccess.date,
  website: postReqSuccess.website,
  host_name: postReqSuccess.host_name,
  location: postReqSuccess.location,
  registration_link: postReqSuccess.registration_link,
  phone_number: postReqSuccess.phone_number,
};

const postReqMalformedDate = {
  event_name: postReqSuccess.event_name,
  description: postReqSuccess.description,
  date: '???',
  host_name: postReqSuccess.host_name,
  location: postReqSuccess.location,
  website: postReqSuccess.website,
  registration_link: postReqSuccess.registration_link,
  phone_number: postReqSuccess.phone_number,
  picture: postReqSuccess.picture,
}

const postDynamoDBReqBodySuccess = {
  eventId: { S: '2' },
  event_name: { S: 'Youth Pride Celebration' },
  description: { S: 'Pride celebration for youth ages 14-18' },
  date: { S: '2024-09-15T08:30:25' },
  host_name: { S: 'Sam' },
  location: {
    M: {
      street: { S: '360 Winter Street' },
      city: { S: 'Waltham' },
      state: { S: 'MA' },
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

const postDynamoDBReqBodySuccessNoHostName = {
  eventId: postDynamoDBReqBodySuccess.eventId,
  event_name: postDynamoDBReqBodySuccess.event_name,
  description: postDynamoDBReqBodySuccess.description,
  date: postDynamoDBReqBodySuccess.date,
  location: postDynamoDBReqBodySuccess.location,
  website: postDynamoDBReqBodySuccess.website,
  registration_link: postDynamoDBReqBodySuccess.registration_link,
  phone_number: postDynamoDBReqBodySuccess.phone_number,
  picture: postDynamoDBReqBodySuccess.picture,
};

const postDynamoDBReqBodySuccessNoLocation = {
  eventId: postDynamoDBReqBodySuccess.eventId,
  event_name: postDynamoDBReqBodySuccess.event_name,
  host_name: postDynamoDBReqBodySuccess.host_name,
  description: postDynamoDBReqBodySuccess.description,
  date: postDynamoDBReqBodySuccess.date,
  website: postDynamoDBReqBodySuccess.website,
  registration_link: postDynamoDBReqBodySuccess.registration_link,
  phone_number: postDynamoDBReqBodySuccess.phone_number,
  picture: postDynamoDBReqBodySuccess.picture,
};

const postDynamoDBReqBodySuccessNoCountry = {
  eventId: postDynamoDBReqBodySuccess.eventId,
  event_name: postDynamoDBReqBodySuccess.event_name,
  host_name: postDynamoDBReqBodySuccess.host_name,
  description: postDynamoDBReqBodySuccess.description,
  date: postDynamoDBReqBodySuccess.date,
  location: {
    M: {
      street: postDynamoDBReqBodySuccess.location.M.street,
      city: postDynamoDBReqBodySuccess.location.M.city,
      state: postDynamoDBReqBodySuccess.location.M.state,
      zipCode: postDynamoDBReqBodySuccess.location.M.zipCode,
    },
  },
  website: postDynamoDBReqBodySuccess.website,
  registration_link: postDynamoDBReqBodySuccess.registration_link,
  phone_number: postDynamoDBReqBodySuccess.phone_number,
  picture: postDynamoDBReqBodySuccess.picture,
};

const postDynamoDBReqBodySuccessNoWebsite = {
  eventId: postDynamoDBReqBodySuccess.eventId,
  event_name: postDynamoDBReqBodySuccess.event_name,
  host_name: postDynamoDBReqBodySuccess.host_name,
  description: postDynamoDBReqBodySuccess.description,
  date: postDynamoDBReqBodySuccess.date,
  location: postDynamoDBReqBodySuccess.location,
  registration_link: postDynamoDBReqBodySuccess.registration_link,
  phone_number: postDynamoDBReqBodySuccess.phone_number,
  picture: postDynamoDBReqBodySuccess.picture,
};

const postDynamoDBReqBodySuccessNoRegistrationLink = {
  eventId: postDynamoDBReqBodySuccess.eventId,
  event_name: postDynamoDBReqBodySuccess.event_name,
  host_name: postDynamoDBReqBodySuccess.host_name,
  description: postDynamoDBReqBodySuccess.description,
  date: postDynamoDBReqBodySuccess.date,
  website: postDynamoDBReqBodySuccess.website,
  location: postDynamoDBReqBodySuccess.location,
  phone_number: postDynamoDBReqBodySuccess.phone_number,
  picture: postDynamoDBReqBodySuccess.picture,
};

const postDynamoDBReqBodySuccessNoPhoneNumber = {
  eventId: postDynamoDBReqBodySuccess.eventId,
  event_name: postDynamoDBReqBodySuccess.event_name,
  host_name: postDynamoDBReqBodySuccess.host_name,
  description: postDynamoDBReqBodySuccess.description,
  date: postDynamoDBReqBodySuccess.date,
  website: postDynamoDBReqBodySuccess.website,
  registration_link: postDynamoDBReqBodySuccess.registration_link,
  location: postDynamoDBReqBodySuccess.location,
  picture: postDynamoDBReqBodySuccess.picture,
};

const postDynamoDBReqBodySuccessNoPicture = {
  eventId: postDynamoDBReqBodySuccess.eventId,
  event_name: postDynamoDBReqBodySuccess.event_name,
  host_name: postDynamoDBReqBodySuccess.host_name,
  description: postDynamoDBReqBodySuccess.description,
  date: postDynamoDBReqBodySuccess.date,
  website: postDynamoDBReqBodySuccess.website,
  registration_link: postDynamoDBReqBodySuccess.registration_link,
  location: postDynamoDBReqBodySuccess.location,
  phone_number: postDynamoDBReqBodySuccess.phone_number,
};

const postReturnSuccess = {
  $metadata: {
    httpStatusCode: 200,
    requestId: '18I3TTSM5018GTL29UV9O48VENVV4KQNSO5AEMVJF66Q9ASUAAJG',
    attempts: 1,
    totalRetryDelay: 0,
  },
  id: 2,
};

const getEventReqSuccess = {
  eventId: '6',
  event_name: 'Youth Pride Celebration',
  description: 'Pride celebration for youth ages 14-18',
  date: '2024-09-15T08:30:25',
  host_name: 'Sam',
  location: {
    street: '360 Winter Street',
    city: 'Waltham',
    state: 'MA',
    zipCode: '02451',
    country: 'United States',
  },
  website: 'https://google.com',
  registration_link: 'https://google.com',
  phone_number: '000-000-0000',
  picture: ['', '', ''],
};

const getEventReqSuccessDynamoDB = [{
  eventId: { S: '6' },
  event_name: { S: postReqSuccess.event_name },
  description: { S: postReqSuccess.description },
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
    date: '2024-09-15T08:30:25',
    host_name: 'Sam',
    location: {
      street: '360 Winter Street',
      city: 'Waltham',
      state: 'MA',
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
    date: '2024-09-15T08:30:25',
    host_name: 'Sam',
    location: {
      street: '360 Winter Street',
      city: 'Waltham',
      state: 'MA',
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
    description: { S: postReqSuccess.description },
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
    description: { S: postReqSuccess.description },
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

describe('EventService', () => {
  let service: EventService;
  let mockDynamoDB: {
    scanTable: jest.Mock<any, any>;
    getHighestId: jest.Mock<any, any>;
    postItem: jest.Mock<any, any>;
    getItem: jest.Mock<any, any>;
    deleteItem: jest.Mock<any, any>;
    updateAttributes: jest.Mock<any, any>;
  };

  beforeEach(async () => {
    mockDynamoDB = {
      scanTable: jest.fn(),
      getHighestId: jest.fn(),
      postItem: jest.fn(),
      getItem: jest.fn(),
      deleteItem: jest.fn(),
      updateAttributes: jest.fn(),
    };
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
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postEvent(postReqSuccess);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkEvents',
        postDynamoDBReqBodySuccess
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should correctly fail if dynamoDB returns an error for getHighestId', async () => {
      mockDynamoDB.getHighestId.mockRejectedValue(
        new Error('highest shelter id error')
      );
      await expect(service.postEvent(postReqSuccess)).rejects.toThrow(new Error(
        'Unable to create event: Error: highest shelter id error'
      ));
      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId'
      );
    });

    it('should correctly fail if dynamoDB returns an error for postItem', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockRejectedValue(
        new Error('dynamodb post item error')
      );
      await expect(service.postEvent(postReqSuccess)).rejects.toThrow(new Error(
        'Unable to create event: Error: dynamodb post item error'
      ));
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkEvents',
        postDynamoDBReqBodySuccess
      );
    });

    it('should correctly fail if the date is not formatted correctly', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(2);

      await expect(service.postEvent(postReqMalformedDate)).rejects.toThrow(new Error(
        'Invalid date format. Please provide a valid date.'
      ));
    })

    it('Dynamodb should not receive a host name if a host name is not provided', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postEvent(postReqSuccessNoHostName);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkEvents',
        postDynamoDBReqBodySuccessNoHostName
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('Dynamodb should not receive a location if a location is not provided', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postEvent(postReqSuccessNoLocation);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkEvents',
        postDynamoDBReqBodySuccessNoLocation
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('Dynamodb should not receive a country if a country is not provided', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postEvent(postReqSuccessNoCountry);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkEvents',
        postDynamoDBReqBodySuccessNoCountry
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('Dynamodb should not receive a website if a website is not provided', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postEvent(postReqSuccessNoWebsite);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkEvents',
        postDynamoDBReqBodySuccessNoWebsite
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('Dynamodb should not receive a registration link if a registration link is not provided', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postEvent(postReqSuccessNoRegistrationLink);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkEvents',
        postDynamoDBReqBodySuccessNoRegistrationLink
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('Dynamodb should not receive a phone number if a phone number is not provided', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postEvent(postReqSuccessNoPhoneNumber);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkEvents',
        postDynamoDBReqBodySuccessNoPhoneNumber
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('Dynamodb should not receive a picture if a picture is not provided', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postEvent(postReqSuccessNoPicture);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkEvents',
        postDynamoDBReqBodySuccessNoPicture
      );
      expect(response).toStrictEqual(postReturnSuccess);
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
      await expect(service.getEvents()).rejects.toThrow(new Error(
        'Unable to get events: Error: dynamodb scanTable error'
      ));
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkEvents'
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
        { ':eventId': { 'S': '6' } }
      );
      expect(response).toStrictEqual(getEventReqSuccess);
    });

    it('should return an event without host name if DynamoDB returns one without it', async () => {
      let mockReturn: any = deepClone(postDynamoDBReqBodySuccessNoHostName);
      mockReturn.eventId = { S: '6' };
      mockDynamoDB.scanTable.mockResolvedValue([mockReturn]);

      const response = await service.getEvent('6');
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId = :eventId',
        { ':eventId': { 'S': '6' } }
      );
      let expected: any = deepClone(postReqSuccessNoHostName);
      expected.eventId = '6';
      expect(response).toStrictEqual(expected);
    });

    it('should return an event without location if DynamoDB returns one without it', async () => {
      let mockReturn: any = deepClone(postDynamoDBReqBodySuccessNoLocation);
      mockReturn.eventId = { S: '6' };
      mockDynamoDB.scanTable.mockResolvedValue([mockReturn]);

      const response = await service.getEvent('6');
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId = :eventId',
        { ':eventId': { 'S': '6' } }
      );
      let expected: any = deepClone(postReqSuccessNoLocation);
      expected.eventId = '6';
      expect(response).toStrictEqual(expected);
    });

    it('should return an event without country if DynamoDB returns one without it', async () => {
      let mockReturn: any = deepClone(postDynamoDBReqBodySuccessNoCountry);
      mockReturn.eventId = { S: '6' };
      mockDynamoDB.scanTable.mockResolvedValue([mockReturn]);

      const response = await service.getEvent('6');
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId = :eventId',
        { ':eventId': { 'S': '6' } }
      );
      let expected: any = deepClone(postReqSuccessNoCountry);
      expected.eventId = '6';
      expect(response).toStrictEqual(expected);
    });

    it('should return an event without website if DynamoDB returns one without it', async () => {
      let mockReturn: any = deepClone(postDynamoDBReqBodySuccessNoWebsite);
      mockReturn.eventId = { S: '6' };
      mockDynamoDB.scanTable.mockResolvedValue([mockReturn]);

      const response = await service.getEvent('6');
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId = :eventId',
        { ':eventId': { 'S': '6' } }
      );
      let expected: any = deepClone(postReqSuccessNoWebsite);
      expected.eventId = '6';
      expect(response).toStrictEqual(expected);
    });

    it('should return an event without Registration Link if DynamoDB returns one without it', async () => {
      let mockReturn: any = deepClone(postDynamoDBReqBodySuccessNoRegistrationLink);
      mockReturn.eventId = { S: '6' };
      mockDynamoDB.scanTable.mockResolvedValue([mockReturn]);

      const response = await service.getEvent('6');
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId = :eventId',
        { ':eventId': { 'S': '6' } }
      );
      let expected: any = deepClone(postReqSuccessNoRegistrationLink);
      expected.eventId = '6';
      expect(response).toStrictEqual(expected);
    });

    it('should return an event without Phone Number if DynamoDB returns one without it', async () => {
      let mockReturn: any = deepClone(postDynamoDBReqBodySuccessNoPhoneNumber);
      mockReturn.eventId = { S: '6' };
      mockDynamoDB.scanTable.mockResolvedValue([mockReturn]);

      const response = await service.getEvent('6');
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId = :eventId',
        { ':eventId': { 'S': '6' } }
      );
      let expected: any = deepClone(postReqSuccessNoPhoneNumber);
      expected.eventId = '6';
      expect(response).toStrictEqual(expected);
    });

    it('should return an event without a Picture if DynamoDB returns one without it', async () => {
      let mockReturn: any = deepClone(postDynamoDBReqBodySuccessNoPicture);
      mockReturn.eventId = { S: '6' };
      mockDynamoDB.scanTable.mockResolvedValue([mockReturn]);

      const response = await service.getEvent('6');
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId = :eventId',
        { ':eventId': { 'S': '6' } }
      );
      let expected: any = deepClone(postReqSuccessNoPicture);
      expected.eventId = '6';
      expect(response).toStrictEqual(expected);
    });

    it('should correctly fail if DynamoDB returns an error for scanTable', async () => {
      mockDynamoDB.scanTable.mockRejectedValue(
        new Error('dynamodb scanTable error')
      );
      await expect(service.getEvent('6')).rejects.toThrow(new Error(
        'Event with id 6 does not exist: dynamodb scanTable error'
      ));
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkEvents',
        'eventId = :eventId',
        { ':eventId': { S: '6' } }
      );
    });
  });
});
