import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDbService } from '../../../backend/src/dynamodb'; // Import your DynamoDB service
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { error } from 'console';
import { NotFoundException } from '@nestjs/common/exceptions';

const errorSpy = jest.spyOn(global.console, 'error');

const event = {
  Item: {
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
    }
  }
};

const shelterForDelete = {
  Item: {
    shelterId: { S: '1' },
    name: { S: 'Curry Student Center' },
    expanded_name: { S: 'Curry Student Center Northeastern University' },
    address: {
      M: {
        street: {
          S: '360 Huntington Ave',
        },
        city: {
          S: 'Boston',
        },
        state: {
          S: 'MA',
        },
        zipCode: {
          S: '02115',
        },
        country: {
          S: 'United States',
        },
      },
    },
    latitude: { N: '42.338925' },
    longitude: { N: '-71.088128' },
    description: {
      S: 'The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University',
    },
    phone_number: { S: '617-373-2000' },
    email_address: { S: 'cie@northeastern.edu' },
    hours: {
      M: {
        Monday: {
          M: {
            closing_time: {
              S: '23:00',
            },
            opening_time: {
              S: '07:00',
            },
          },
        },
        Tuesday: null,
        Wednesday: {
          M: {
            closing_time: {
              S: '23:00',
            },
            opening_time: {
              S: '07:00',
            },
          },
        },
        Thursday: {
          M: {
            closing_time: {
              S: '23:00',
            },
            opening_time: {
              S: '07:00',
            },
          },
        },
        Friday: {
          M: {
            closing_time: {
              S: '23:00',
            },
            opening_time: {
              S: '07:00',
            },
          },
        },
        Saturday: {
          M: {
            closing_time: {
              S: '23:00',
            },
            opening_time: {
              S: '08:00',
            },
          },
        },
        Sunday: {
          M: {
            closing_time: {
              S: '23:00',
            },
            opening_time: {
              S: '10:00',
            },
          },
        },
      },
    },
    picture: {
      L: [
        {
          S: 'https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain',
        },
        {
          S: 'https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg',
        },
        {
          S: 'https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg',
        },
      ],
    },
    rating: { N: '4.6' },
    website: { S: 'https://calendar.northeastern.edu/curry_student_center' },
    tags: {
      M: {
        clothing_resources: { BOOL: false },
        educational_programs: { BOOL: false },
        family_friendly: { BOOL: false },
        food_resources: { BOOL: false },
        hygiene_facilities: { BOOL: false },
        job_assistance: { BOOL: false },
        legal_aid: { BOOL: false },
        lgbtq_focused: { BOOL: false },
        medical_resources: { BOOL: false },
        mental_health_resources: { BOOL: false },
        overnight_stay: { BOOL: false },
        pet_friendly: { BOOL: false },
        substance_abuse_support: { BOOL: false },
        transportation_resources: { BOOL: false },
        wheelchair_accessible: { BOOL: false },
      },
    },
  }
}


const scanTableReturn = {
  Items: [
    event.Item,
    {
      eventId: { S: '5' },
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
      }
    }
  ]
}


const userItems = {
  Items: [{
    userId: "1",
    first_name: "Sam",
    last_name: "Nie",
    email: "nie.sa@northeastern.edu",
    created_at: '2024-09-15T08:30:25',
  }]
};

const updateShelterDynamoDbInput_buildAttributeNamesList = [
  'name',
  'address.city',
  'address.country',
  'address.state',
  'address.street',
  'address.zipCode',
  'latitude',
  'longitude',
  'description',
  'rating',
  'phone_number',
  'email_address',
  'website',
  'picture',
  "tags.wheelchair_accessible",
  "tags.pet_friendly",
  "tags.family_friendly",
  "tags.legal_aid",
  "tags.lgbtq_focused",
  "tags.mental_health_resources",
  "tags.overnight_stay",
  "tags.food_resources",
  "tags.clothing_resources",
  "tags.transportation_resources",
  "tags.hygiene_facilities",
  "tags.job_assistance",
  "tags.medical_resources",
  "tags.educational_programs",
  "tags.substance_abuse_support",
];

const updateShelterDynamoDbInput_buildAttributeValuesList = [
  'Curry Student Center',
  'Boston',
  'United States',
  'MA',
  '360 Huntington Ave',
  '02115',
  42.338925,
  -71.088128,
  'The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University',
  4.6,
  '617-373-2000',
  'cie@northeastern.edu',
  'https://calendar.northeastern.edu/curry_student_center',
  '["https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain","https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg","https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg"]',
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
];

let updateShelterDynamoDbInput_buildAttributeValuesListGreaterThanThreePictures = ['Curry Student Center',
  'Boston',
  'United States',
  'MA',
  '360 Huntington Ave',
  '02115',
  42.338925,
  -71.088128,
  'The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University',
  4.6,
  '617-373-2000',
  'cie@northeastern.edu',
  'https://calendar.northeastern.edu/curry_student_center',
  '["https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain","https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg","https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg","https://www.example.com/image4.jpg"]',
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
];

const updateShelterDynamoDbInput_HoursUpdateModel = {
  Monday: {
    opening_time: '07:00',
    closing_time: '23:00',
  },
  Wednesday: {
    opening_time: '07:00',
    closing_time: '23:00',
  },
  Thursday: {
    opening_time: '07:00',
    closing_time: '23:00',
  },
  Friday: {
    opening_time: '07:00',
    closing_time: '23:00',
  },
  Saturday: {
    opening_time: '08:00',
    closing_time: '23:00',
  },
  Sunday: {
    opening_time: '10:00',
    closing_time: '23:00',
  },
};

const shelter =
{
  Item: {
    shelterId: '17',
    name: 'BAGLY',
    address: {
      street: '123 Main St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
      country: '',
    },
    latitude: 42.3586,
    longitude: -71.180367,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    phone_number: '555-0123',
    email_address: 'contact@shelter.org',
    hours: {
      Monday: {
        opening_time: '06:00',
        closing_time: '20:00',
      },
      Tuesday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
      Wednesday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
      Thursday: {
        opening_time: '06:00',
        closing_time: '20:00',
      },
      Friday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
      Saturday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
      Sunday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
    },
    picture: ['https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp',
    ],
    rating: 4.5,
    website: 'https://www.bagly.org/',
    tags: {
      clothing_resources: false,
      educational_programs: false,
      family_friendly: false,
      food_resources: false,
      hygiene_facilities: false,
      job_assistance: false,
      legal_aid: false,
      lgbtq_focused: false,
      medical_resources: false,
      mental_health_resources: false,
      overnight_stay: false,
      pet_friendly: false,
      substance_abuse_support: false,
      transportation_resources: false,
      wheelchair_accessible: false,
    },
  }
}

const getSheltersReqSuccessDynamoDB =
{
  Item: {
    shelterId: { S: '17' },
    name: { S: 'BAGLY' },
    address: {
      M: {
        street: { S: '123 Main St' },
        city: { S: 'Boston' },
        state: { S: 'MA' },
        zipCode: { S: '02108' },
        country: { S: '' },
      },
    },
    latitude: { N: 42.3586 },
    longitude: { N: -71.180367 },
    description: {
      S: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    phone_number: { S: '555-0123' },
    email_address: { S: 'contact@shelter.org' },
    hours: {
      M: {
        Monday: {
          M: {
            opening_time: { S: '06:00' },
            closing_time: { S: '20:00' },
          },
        },
        Tuesday: {
          M: {
            opening_time: { S: '08:00' },
            closing_time: { S: '20:00' },
          },
        },
        Wednesday: {
          M: {
            opening_time: { S: '08:00' },
            closing_time: { S: '20:00' },
          },
        },
        Thursday: {
          M: {
            opening_time: { S: '06:00' },
            closing_time: { S: '20:00' },
          },
        },
        Friday: {
          M: {
            opening_time: { S: '08:00' },
            closing_time: { S: '20:00' },
          },
        },
        Saturday: {
          M: {
            opening_time: { S: '08:00' },
            closing_time: { S: '20:00' },
          },
        },
        Sunday: {
          M: {
            opening_time: { S: '08:00' },
            closing_time: { S: '20:00' },
          },
        },
      },
    },
    picture: {
      L: [
        {
          S: 'https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp',
        },
      ],
    },
    rating: { N: 4.5 },
    website: { S: 'https://www.bagly.org/' },
    tags: {
      M: {
        clothing_resources: { BOOL: false },
        educational_programs: { BOOL: false },
        family_friendly: { BOOL: false },
        food_resources: { BOOL: false },
        hygiene_facilities: { BOOL: false },
        job_assistance: { BOOL: false },
        legal_aid: { BOOL: false },
        lgbtq_focused: { BOOL: false },
        medical_resources: { BOOL: false },
        mental_health_resources: { BOOL: false },
        overnight_stay: { BOOL: false },
        pet_friendly: { BOOL: false },
        substance_abuse_support: { BOOL: false },
        transportation_resources: { BOOL: false },
        wheelchair_accessible: { BOOL: false },
      },
    },
  }
}

const ExpectedExpressionAttributeNames = {
  "#Friday": "Friday",
  "#Monday": "Monday",
  "#Saturday": "Saturday",
  "#Sunday": "Sunday",
  "#Thursday": "Thursday",
  "#Wednesday": "Wednesday",
  "#address": "address",
  "#city": "city",
  "#clothing_resources": "clothing_resources",
  "#country": "country",
  "#description": "description",
  "#educational_programs": "educational_programs",
  "#email_address": "email_address",
  "#family_friendly": "family_friendly",
  "#food_resources": "food_resources",
  "#hours": "hours",
  "#hygiene_facilities": "hygiene_facilities",
  "#job_assistance": "job_assistance",
  "#latitude": "latitude",
  "#legal_aid": "legal_aid",
  "#lgbtq_focused": "lgbtq_focused",
  "#longitude": "longitude",
  "#medical_resources": "medical_resources",
  "#mental_health_resources": "mental_health_resources",
  "#name": "name",
  "#overnight_stay": "overnight_stay",
  "#pet_friendly": "pet_friendly",
  "#phone_number": "phone_number",
  "#picture": "picture",
  "#rating": "rating",
  "#state": "state",
  "#street": "street",
  "#substance_abuse_support": "substance_abuse_support",
  "#tags": "tags",
  "#transportation_resources": "transportation_resources",
  "#website": "website",
  "#wheelchair_accessible": "wheelchair_accessible",
  "#zipCode": "zipCode",
}

const ExpectedExpressionAttributeValues = {
  ":Friday": {
    "M": {
      "closing_time": {
        "S": "23:00",
      },
      "opening_time": {
        "S": "07:00",
      },
    },
  },
  ":Monday": {
    "M": {
      "closing_time": {
        "S": "23:00",
      },
      "opening_time": {
        "S": "07:00",
      },
    },
  },
  ":Saturday": {
    "M": {
      "closing_time": {
        "S": "23:00",
      },
      "opening_time": {
        "S": "08:00",
      },
    },
  },
  ":Sunday": {
    "M": {
      "closing_time": {
        "S": "23:00",
      },
      "opening_time": {
        "S": "10:00",
      },
    },
  },
  ":Thursday": {
    "M": {
      "closing_time": {
        "S": "23:00",
      },
      "opening_time": {
        "S": "07:00",
      },
    },
  },
  ":Wednesday": {
    "M": {
      "closing_time": {
        "S": "23:00",
      },
      "opening_time": {
        "S": "07:00",
      },
    },
  },
  ":city": {
    "S": "Boston",
  },
  ":clothing_resources": {
    "BOOL": true,
  },
  ":country": {
    "S": "United States",
  },
  ":description": {
    "S": "The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University",
  },
  ":educational_programs": {
    "BOOL": true,
  },
  ":email_address": {
    "S": "cie@northeastern.edu",
  },
  ":family_friendly": {
    "BOOL": true,
  },
  ":food_resources": {
    "BOOL": true,
  },
  ":hygiene_facilities": {
    "BOOL": true,
  },
  ":job_assistance": {
    "BOOL": true,
  },
  ":latitude": {
    "N": "42.338925",
  },
  ":legal_aid": {
    "BOOL": true,
  },
  ":lgbtq_focused": {
    "BOOL": true,
  },
  ":longitude": {
    "N": "-71.088128",
  },
  ":medical_resources": {
    "BOOL": true,
  },
  ":mental_health_resources": {
    "BOOL": true,
  },
  ":name": {
    "S": "Curry Student Center",
  },
  ":overnight_stay": {
    "BOOL": true,
  },
  ":pet_friendly": {
    "BOOL": true,
  },
  ":phone_number": {
    "S": "617-373-2000",
  },
  ":picture": {
    "L": [
      {
        "S": "https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain",
      },
      {
        "S": "https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg",
      },
      {
        "S": "https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg",
      },
    ],
  },
  ":rating": {
    "N": "4.6",
  },
  ":state": {
    "S": "MA",
  },
  ":street": {
    "S": "360 Huntington Ave",
  },
  ":substance_abuse_support": {
    "BOOL": false,
  },
  ":transportation_resources": {
    "BOOL": true,
  },
  ":website": {
    "S": "https://calendar.northeastern.edu/curry_student_center",
  },
  ":wheelchair_accessible": {
    "BOOL": true,
  },
  ":zipCode": {
    "S": "02115",
  },
}


describe('EventService', () => {
  let service: DynamoDbService;
  let mockDynamoDBClient: {
    send: jest.Mock<any, any>;
  };

  beforeEach(async () => {
    mockDynamoDBClient = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamoDbService,
        {
          provide: DynamoDBClient,
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

      mockDynamoDBClient.send.mockResolvedValueOnce(scanTableReturn);

      const response = await service.scanTable('shelterlinkEvents');
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(ScanCommand);
      expect(call.input).toEqual({ TableName: 'shelterlinkEvents' });

      expect(response).toStrictEqual(scanTableReturn.Items);
    });

    it('should return an error when a table name is passed in if dynamodbclient sends an error', async () => {
      mockDynamoDBClient.send.mockRejectedValue(new Error('Service Error'));
      await expect(
        service.scanTable('shelterlinkEvents')
      ).rejects.toThrow(new Error('Unable to scan table shelterlinkEvents'));
      expect(errorSpy).toHaveBeenCalledWith("DynamoDB Scan Error:", new Error('Service Error'));
    });

    it('should scan a table successfully with a table name and filterExpression', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(scanTableReturn);

      const response = await service.scanTable('shelterlinkEvents',
        'eventId = 6',
      );
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(ScanCommand);
      expect(call.input).toEqual(
        {
          TableName: 'shelterlinkEvents',
          FilterExpression: 'eventId = 6',
        });

      expect(response).toStrictEqual(scanTableReturn.Items);
    });

    it('should return an error when a table name and filterExpression are passed in if dynamodbclient sends an error', async () => {
      mockDynamoDBClient.send.mockRejectedValue(new Error('Service Error'));
      await expect(
        service.scanTable('shelterlinkEvents',
          'eventId = 6',
        )
      ).rejects.toThrow(new Error('Unable to scan table shelterlinkEvents'));
      expect(errorSpy).toHaveBeenCalledWith("DynamoDB Scan Error:", new Error('Service Error'));
    });

    it('should scan a table successfully with a table name and filterExpression and expressionAttributeValues', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(scanTableReturn);

      const response = await service.scanTable('shelterlinkEvents',
        'eventId = :eventId',
        { ':eventId': { S: '6' } },
      );
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(ScanCommand);
      expect(call.input).toEqual(
        {
          TableName: 'shelterlinkEvents',
          FilterExpression: 'eventId = :eventId',
          ExpressionAttributeValues: { ':eventId': { S: '6' } },
        });

      expect(response).toStrictEqual(scanTableReturn.Items);
    });

    it('should return an error when a table name and filterExpression and expressionAttributeValues are passed in if dynamodbclient sends an error', async () => {
      mockDynamoDBClient.send.mockRejectedValue(new Error('Service Error'));
      await expect(
        service.scanTable('shelterlinkEvents',
          'eventId = :eventId',
          { ':eventId': { S: '6' } },
        )
      ).rejects.toThrow(new Error('Unable to scan table shelterlinkEvents'));
      expect(errorSpy).toHaveBeenCalledWith("DynamoDB Scan Error:", new Error('Service Error'));
    });

    it('should scan a table successfully with a table name and filterExpression and expressionAttributeNames', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(scanTableReturn);

      const response = await service.scanTable('shelterlinkEvents',
        '#eventId = 6',
        undefined,
        { '#eventId': 'eventId' },
      );
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(ScanCommand);
      expect(call.input).toEqual(
        {
          TableName: 'shelterlinkEvents',
          FilterExpression: '#eventId = 6',
          ExpressionAttributeNames: { '#eventId': 'eventId' },
        });

      expect(response).toStrictEqual(scanTableReturn.Items);
    });

    it('should return an error when a table name and filterExpression and expressionAttributeNames are passed in if dynamodbclient sends an error', async () => {
      mockDynamoDBClient.send.mockRejectedValue(new Error('Service Error'));
      await expect(
        service.scanTable('shelterlinkEvents',
          '#eventId = 6',
          undefined,
          { '#eventId': 'eventId' },
        )
      ).rejects.toThrow(new Error('Unable to scan table shelterlinkEvents'));
      expect(errorSpy).toHaveBeenCalledWith("DynamoDB Scan Error:", new Error('Service Error'));

    });

    it('should scan a table successfully with a table name and filterExpression and expressionAttributeValues and expressionAttributeNames', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(scanTableReturn);

      const response = await service.scanTable('shelterlinkEvents',
        '#eventId = :eventId',
        { ':eventId': { S: '6' } },
        { '#eventId': 'eventId' }
      );
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(ScanCommand);
      expect(call.input).toEqual(
        {
          TableName: 'shelterlinkEvents',
          FilterExpression: '#eventId = :eventId',
          ExpressionAttributeValues: { ':eventId': { S: '6' } },
          ExpressionAttributeNames: { '#eventId': 'eventId' },
        });

      expect(response).toStrictEqual(scanTableReturn.Items);
    });

    it('should return an error when a table name and filterExpression and expressionAttributeValues and expressionAttributeNames are passed in if dynamodbclient sends an error', async () => {
      mockDynamoDBClient.send.mockRejectedValue(new Error('Service Error'));
      await expect(
        service.scanTable('shelterlinkEvents',
          '#eventId = :eventId',
          { ':eventId': { S: '6' } },
          { '#eventId': 'eventId' }
        )
      ).rejects.toThrow(new Error('Unable to scan table shelterlinkEvents'));
      expect(errorSpy).toHaveBeenCalledWith("DynamoDB Scan Error:", new Error('Service Error'));
    });

    it('should return an empty list if null is returned by the client', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce({ Items: null });
      const response = await service.scanTable('shelterlinkEvents');
      expect(response).toEqual([]);
    });

  });

  describe('getHighestId', () => {
    it('should return the highest ID from the table', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce({
        Items: [
          event.Item,]
      });

      const response = await service.getHighestId('shelterlinkEvents', 'eventId');
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(ScanCommand);
      expect(call.input).toEqual({ TableName: 'shelterlinkEvents', ProjectionExpression: 'eventId' });

      expect(response).toEqual(1); // Assuming the highest ID is 1 in the mock data
    });

    it('should return the highest ID from the table with one item from the client', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(scanTableReturn);

      const response = await service.getHighestId('shelterlinkEvents', 'eventId');
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(ScanCommand);
      expect(call.input).toEqual({ TableName: 'shelterlinkEvents', ProjectionExpression: 'eventId' });

      expect(response).toEqual(5); // Assuming the highest ID is 1 in the mock data
    });

    it('should return an error if mockDynamoDBClient sends an error', async () => {
      mockDynamoDBClient.send.mockRejectedValue(new Error('Service Error'));
      await expect(
        service.getHighestId('shelterlinkEvents', 'eventId')
      ).rejects.toThrow(new Error('Unable to scan table shelterlinkEvents'));
      expect(errorSpy).toHaveBeenCalledWith("DynamoDB Scan Error:", new Error('Service Error'));
    });

    it('should return undefined if no items are found by the client', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce({ Items: [] });
      const response = await service.getHighestId('shelterlinkEvents', 'eventId');
      expect(response).toEqual(undefined);
    });

    it('should return undefined if an empty object is returned by the client', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce({ Items: [{}] });
      const response = await service.getHighestId('shelterlinkEvents', 'eventId');
      expect(response).toEqual(undefined);
    });

    it('should not count ids that cant be parsed into a number', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce({ Items: [{ eventId: { S: { 'object': 'object' } } }, { eventId: { S: 1 } }] });
      const response = await service.getHighestId('shelterlinkEvents', 'eventId');
      expect(response).toEqual(1);
    });
  });

  describe('postItem', () => {
    it('should successfully post an item', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce('response');
      const response = await service.postItem('shelterlinkEvents', event);
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(PutItemCommand);
      expect(call.input).toEqual({ TableName: 'shelterlinkEvents', Item: event });
      expect(response).toEqual('response');
    });

    it('should return an error if mockDynamoDBClient sends an error', async () => {
      mockDynamoDBClient.send.mockRejectedValue(new Error('Service Error'));
      await expect(
        service.postItem('shelterlinkEvents', event)
      ).rejects.toThrow(new Error('Error: Service Error'));
      expect(errorSpy).toHaveBeenCalledWith("Error posting item to table shelterlinkEvents");
    });
  })

  describe('mockResolvedValueOnce', () => {
    it('should successfully update attributes', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(shelter);
      mockDynamoDBClient.send.mockResolvedValueOnce('response');

      const response = await service.updateAttributes(
        'shelterlinkShelters',
        '17',
        updateShelterDynamoDbInput_buildAttributeNamesList,
        updateShelterDynamoDbInput_buildAttributeValuesList,
        updateShelterDynamoDbInput_HoursUpdateModel
      );
      expect(mockDynamoDBClient.send).toHaveBeenCalledTimes(2);
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(GetItemCommand);
      const call2 = mockDynamoDBClient.send.mock.calls[1][0];
      expect(call2).toBeInstanceOf(UpdateItemCommand);
      expect(call2.input).toEqual(expect.objectContaining({
        TableName: 'shelterlinkShelters',
        ReturnValues: 'UPDATED_NEW',
        Key: { shelterId: { S: '17' } },
        UpdateExpression: "SET #hours.#Sunday = :Sunday, #hours.#Monday = :Monday, #hours.#Wednesday = :Wednesday, #hours.#Thursday = :Thursday, #hours.#Friday = :Friday, #hours.#Saturday = :Saturday, #name = :name, #address.#city = :city, #address.#country = :country, #address.#state = :state, #address.#street = :street, #address.#zipCode = :zipCode, #latitude = :latitude, #longitude = :longitude, #description = :description, #rating = :rating, #phone_number = :phone_number, #email_address = :email_address, #website = :website, #picture = :picture, #tags.#wheelchair_accessible = :wheelchair_accessible, #tags.#pet_friendly = :pet_friendly, #tags.#family_friendly = :family_friendly, #tags.#legal_aid = :legal_aid, #tags.#lgbtq_focused = :lgbtq_focused, #tags.#mental_health_resources = :mental_health_resources, #tags.#overnight_stay = :overnight_stay, #tags.#food_resources = :food_resources, #tags.#clothing_resources = :clothing_resources, #tags.#transportation_resources = :transportation_resources, #tags.#hygiene_facilities = :hygiene_facilities, #tags.#job_assistance = :job_assistance, #tags.#medical_resources = :medical_resources, #tags.#educational_programs = :educational_programs, #tags.#substance_abuse_support = :substance_abuse_support",
        ExpressionAttributeNames: ExpectedExpressionAttributeNames,
        ExpressionAttributeValues: ExpectedExpressionAttributeValues,
      }))
      expect(response).toEqual('response');
    });

    it('should truncate picture list of length 3+ to only update the first 3 given', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(shelter);
      mockDynamoDBClient.send.mockResolvedValueOnce('response');

      const response = await service.updateAttributes(
        'shelterlinkShelters',
        '17',
        updateShelterDynamoDbInput_buildAttributeNamesList,
        updateShelterDynamoDbInput_buildAttributeValuesListGreaterThanThreePictures,
        updateShelterDynamoDbInput_HoursUpdateModel
      );
      expect(mockDynamoDBClient.send).toHaveBeenCalledTimes(2);
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(GetItemCommand);
      const call2 = mockDynamoDBClient.send.mock.calls[1][0];
      expect(call2).toBeInstanceOf(UpdateItemCommand);
      expect(call2.input).toEqual(expect.objectContaining({
        TableName: 'shelterlinkShelters',
        ReturnValues: 'UPDATED_NEW',
        Key: { shelterId: { S: '17' } },
        UpdateExpression: "SET #hours.#Sunday = :Sunday, #hours.#Monday = :Monday, #hours.#Wednesday = :Wednesday, #hours.#Thursday = :Thursday, #hours.#Friday = :Friday, #hours.#Saturday = :Saturday, #name = :name, #address.#city = :city, #address.#country = :country, #address.#state = :state, #address.#street = :street, #address.#zipCode = :zipCode, #latitude = :latitude, #longitude = :longitude, #description = :description, #rating = :rating, #phone_number = :phone_number, #email_address = :email_address, #website = :website, #picture = :picture, #tags.#wheelchair_accessible = :wheelchair_accessible, #tags.#pet_friendly = :pet_friendly, #tags.#family_friendly = :family_friendly, #tags.#legal_aid = :legal_aid, #tags.#lgbtq_focused = :lgbtq_focused, #tags.#mental_health_resources = :mental_health_resources, #tags.#overnight_stay = :overnight_stay, #tags.#food_resources = :food_resources, #tags.#clothing_resources = :clothing_resources, #tags.#transportation_resources = :transportation_resources, #tags.#hygiene_facilities = :hygiene_facilities, #tags.#job_assistance = :job_assistance, #tags.#medical_resources = :medical_resources, #tags.#educational_programs = :educational_programs, #tags.#substance_abuse_support = :substance_abuse_support",
        ExpressionAttributeNames: ExpectedExpressionAttributeNames,
        ExpressionAttributeValues: ExpectedExpressionAttributeValues,
      }))
      expect(response).toEqual('response');
    });

    it('should successfully update attributes when updating pictures with a list of length 1', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(shelter);
      mockDynamoDBClient.send.mockResolvedValueOnce('response');

      const response = await service.updateAttributes(
        'shelterlinkShelters',
        '17',
        ['picture'],
        ['["https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp"]'],
        false
      );
      expect(mockDynamoDBClient.send).toHaveBeenCalledTimes(2);
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(GetItemCommand);
      const call2 = mockDynamoDBClient.send.mock.calls[1][0];
      expect(call2).toBeInstanceOf(UpdateItemCommand);
      expect(call2.input).toEqual({
        TableName: 'shelterlinkShelters',
        ReturnValues: 'UPDATED_NEW',
        Key: { shelterId: { S: '17' } },
        UpdateExpression: "SET #picture = :picture",
        ExpressionAttributeNames: { "#picture": "picture" },
        ExpressionAttributeValues: {
          ":picture": {
            "L": [
              {
                "S": "https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp",
              },
            ],
          }
        },
      });
      expect(response).toEqual('response');
    });

    it('should successfully update attributes when updating pictures with a list of length 2', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(shelter);
      mockDynamoDBClient.send.mockResolvedValueOnce('response');

      const response = await service.updateAttributes(
        'shelterlinkShelters',
        '17',
        ['picture'],
        ['["https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp","https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo2.webp"]'],
        false
      );
      expect(mockDynamoDBClient.send).toHaveBeenCalledTimes(2);
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(GetItemCommand);
      const call2 = mockDynamoDBClient.send.mock.calls[1][0];
      expect(call2).toBeInstanceOf(UpdateItemCommand);
      expect(call2.input).toEqual({
        TableName: 'shelterlinkShelters',
        ReturnValues: 'UPDATED_NEW',
        Key: { shelterId: { S: '17' } },
        UpdateExpression: "SET #picture = :picture",
        ExpressionAttributeNames: { "#picture": "picture" },
        ExpressionAttributeValues: {
          ":picture": {
            "L": [
              {
                "S": "https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp",
              },
              {
                "S": "https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo2.webp",
              },
            ],
          }
        },
      });
      expect(response).toEqual('response');
    });

    it('should return an error if attributeNames and attributeValues are not the same length', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(shelter);
      await expect(service.updateAttributes(
        'shelterlinkShelters',
        '17',
        [],
        updateShelterDynamoDbInput_buildAttributeValuesList,
        updateShelterDynamoDbInput_HoursUpdateModel
      )).rejects.toThrow(new Error('Error updating attributes of shelter 17 to table shelterlinkShelters: '
        + 'attributeNames and attributeValues must be the same length'));
    });

    it('should return NotFoundException if the client doesnt return the item', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce({ Item: null });
      await expect(service.updateAttributes(
        'shelterlinkShelters',
        '17',
        updateShelterDynamoDbInput_buildAttributeNamesList,
        updateShelterDynamoDbInput_buildAttributeValuesList,
        updateShelterDynamoDbInput_HoursUpdateModel
      )).rejects.toThrow(new NotFoundException('Shelter with ID 17 not found.'));
    });

    it('should return an error if mockDynamoDBClient sends an error', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(shelter);
      mockDynamoDBClient.send.mockRejectedValueOnce(new Error('Service Error'));
      await expect(
        service.updateAttributes(
          'shelterlinkShelters',
          '17',
          updateShelterDynamoDbInput_buildAttributeNamesList,
          updateShelterDynamoDbInput_buildAttributeValuesList,
          updateShelterDynamoDbInput_HoursUpdateModel
        )
      ).rejects.toThrow(new Error('Error: Service Error'));
      expect(errorSpy).toHaveBeenCalledWith("Error updating name,address.city,address.country,address.state,address.street,address.zipCode,latitude,longitude,description,rating,phone_number,email_address,website,picture,tags.wheelchair_accessible,tags.pet_friendly,tags.family_friendly,tags.legal_aid,tags.lgbtq_focused,tags.mental_health_resources,tags.overnight_stay,tags.food_resources,tags.clothing_resources,tags.transportation_resources,tags.hygiene_facilities,tags.job_assistance,tags.medical_resources,tags.educational_programs,tags.substance_abuse_support to Curry Student Center,Boston,United States,MA,360 Huntington Ave,02115,42.338925,-71.088128,The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University,4.6,617-373-2000,cie@northeastern.edu,https://calendar.northeastern.edu/curry_student_center,[\"https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain\",\"https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg\",\"https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg\"],true,true,true,true,true,true,true,true,true,true,true,true,true,true,false for shelter 17 to table shelterlinkShelters");
    });
  })

  describe('getItem', () => {
    it('should get an item from the table', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(event);

      const response = await service.getItem('shelterlinkEvents', { "event": "1" });
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(GetItemCommand);
      expect(call.input).toEqual({ TableName: 'shelterlinkEvents', Key: { "event": "1" } });
      expect(response).toEqual(event.Item); // Assuming the highest ID is 1 in the mock data
    });

    it('should return an error if mockDynamoDBClient sends an error', async () => {
      mockDynamoDBClient.send.mockRejectedValue(new Error('Service Error'));
      await expect(
        service.getItem('shelterlinkEvents', { "event": "1" })
      ).rejects.toThrow(new Error('Unable to get item from shelterlinkEvents: Service Error'));
    });
  });

  describe('deleteItem', () => {
    it('should successfully delete a shelter item from the table', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(shelterForDelete);
      const response = await service.deleteItem('shelterlinkShelters', { "shelterId": "1" });
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(GetItemCommand);
      expect(call.input).toEqual({ TableName: 'shelterlinkShelters', Key: { "shelterId": "1" } });
      const call2 = mockDynamoDBClient.send.mock.calls[1][0];
      expect(call2).toBeInstanceOf(DeleteItemCommand);
      expect(call2.input).toEqual({ TableName: 'shelterlinkShelters', Key: { "shelterId": "1" } });
      expect(response).toEqual(true);
    });

    it('should successfully delete a shelter item from the table', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(event);
      const response = await service.deleteItem('shelterlinkEvents', { "eventId": "1" });
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(GetItemCommand);
      expect(call.input).toEqual({ TableName: 'shelterlinkEvents', Key: { "eventId": "1" } });
      const call2 = mockDynamoDBClient.send.mock.calls[1][0];
      expect(call2).toBeInstanceOf(DeleteItemCommand);
      expect(call2.input).toEqual({ TableName: 'shelterlinkEvents', Key: { "eventId": "1" } });
      expect(response).toEqual(true);
    });

    it('should return an error if mockDynamoDBClient sends an error when getting the item to check if it exists', async () => {
      mockDynamoDBClient.send.mockRejectedValueOnce(new Error('Service Error'));
      await expect(
        service.deleteItem('shelterlinkShelters', { "shelterId": { S: "1" } })
      ).rejects.toThrow(new Error('Unable to delete item from shelterlinkShelters: Unable to get item from shelterlinkShelters: Service Error'));
      expect(errorSpy).toHaveBeenCalledTimes(2);

      expect(errorSpy.mock.calls).toEqual(
        expect.arrayContaining([
          expect.arrayContaining([
            "DynamoDB GetItem Error:",
            expect.objectContaining({ message: "Service Error" }),
          ]),
          expect.arrayContaining([
            "DynamoDB Delete Error:",
            expect.objectContaining({ message: "Unable to get item from shelterlinkShelters: Service Error" }),
          ]),
        ])
      );
    });

    it('should return an error if mockDynamoDBClient sends an error when deleting', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce(event);
      mockDynamoDBClient.send.mockRejectedValueOnce(new Error('Service Error'));
      await expect(
        service.deleteItem('shelterlinkShelters', { "shelterId": { S: "1" } })
      ).rejects.toThrow(new Error('Unable to delete item from shelterlinkShelters: Service Error'));
      expect(errorSpy).toHaveBeenCalledWith("DynamoDB Delete Error:", new Error('Service Error'));
    });

    it('should return NotFoundException if the client doesnt return the item for a shelter', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce({});
      await expect(
        service.deleteItem('shelterlinkShelters', { "shelterId": { S: "17" } })
      ).rejects.toThrow(new NotFoundException('Unable to delete item from shelterlinkShelters: Shelter with ID 17 not found.'));
    });

    it('should return NotFoundException if the client doesnt return the item for an event', async () => {
      mockDynamoDBClient.send.mockResolvedValueOnce({});
      await expect(
        service.deleteItem('shelterlinkShelters', { "eventId": { S: "17" } })
      ).rejects.toThrow(new NotFoundException('Unable to delete item from shelterlinkShelters: Event with ID 17 not found.'));
    });
  });

  describe('checkIfEmailExists', () => {
    it('should successfully check if an email exists', async () => {
      const params = {
        TableName: 'shelterlinkEvents',
        IndexName: 'email-index', // We have a secondary index on the email attribute
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': { S: 'nie.sa@northeastern.edu' },
        },
      };

      mockDynamoDBClient.send.mockResolvedValueOnce(userItems);
      const response = await service.checkIfEmailExists('shelterlinkEvents', 'nie.sa@northeastern.edu');
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(QueryCommand);
      expect(call.input).toEqual(params);
      expect(response).toEqual(true);
    });

    it('should return false if the email does not exist', async () => {
      const params = {
        TableName: 'shelterlinkEvents',
        IndexName: 'email-index', // We have a secondary index on the email attribute
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': { S: 'nie.sa@northeastern.edu' },
        },
      };
      mockDynamoDBClient.send.mockResolvedValueOnce({ Items: [] });

      const response = await service.checkIfEmailExists('shelterlinkEvents', 'nie.sa@northeastern.edu');
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(QueryCommand);
      expect(call.input).toEqual(params);

      expect(response).toEqual(false);
    });

    it('should return an error if mockDynamoDBClient sends an error', async () => {
      mockDynamoDBClient.send.mockRejectedValue(new Error('Service Error'));
      await expect(
        service.checkIfEmailExists('shelterlinkEvents', 'nie.sa@northeastern.edu')
      ).rejects.toThrow(new Error('Unable to check email uniqueness.'));
      expect(errorSpy).toHaveBeenCalledWith("Error checking email uniqueness:", new Error('Service Error'));
    });
  });

  describe('queryTable', () => {
    it('should successfully query a table', async () => {
      const params = {
        TableName: 'shelterlinkEvents',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': { S: 'nie.sa@northeastern.edu' },
        },
        IndexName: 'email-index', // We have a secondary index on the email attribute
      };

      mockDynamoDBClient.send.mockResolvedValueOnce(userItems);
      const response = await service.queryTable('shelterlinkEvents', 'email = :email', {
        ':email': { S: 'nie.sa@northeastern.edu' },
      }, 'email-index');
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(QueryCommand);
      expect(call.input).toEqual(params);

      expect(response).toEqual(userItems.Items);
    });

    it('should successfully query a table with an index name', async () => {
      const params = {
        TableName: 'shelterlinkEvents',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': { S: 'nie.sa@northeastern.edu' },
        },
      };

      mockDynamoDBClient.send.mockResolvedValueOnce(userItems);
      const response = await service.queryTable('shelterlinkEvents', 'email = :email', {
        ':email': { S: 'nie.sa@northeastern.edu' },
      });
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(QueryCommand);
      expect(call.input).toEqual(params);

      expect(response).toEqual(userItems.Items);
    });

    it('should return an empty list if DynamoDB returns null Items', async () => {
      mockDynamoDBClient.send.mockResolvedValue({ Items: null });
      const params = {
        TableName: 'shelterlinkEvents',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': { S: 'nie.sa@northeastern.edu' },
        },
        IndexName: 'email-index', // We have a secondary index on the email attribute
      };

      const response = await service.queryTable('shelterlinkEvents', 'email = :email', {
        ':email': { S: 'nie.sa@northeastern.edu' },
      }, 'email-index');
      const call = mockDynamoDBClient.send.mock.calls[0][0];
      expect(call).toBeInstanceOf(QueryCommand);
      expect(call.input).toEqual(params);

      expect(response).toEqual([])
    });

    it('should return an error if mockDynamoDBClient sends an error', async () => {
      mockDynamoDBClient.send.mockRejectedValue(new Error('Service Error'));
      await expect(
        service.queryTable('shelterlinkEvents', 'email = :email', {
          ':email': { S: 'nie.sa@northeastern.edu' },
        }, 'email-index'))
        .rejects.toThrow(new Error('Unable to query table shelterlinkEvents'));
      expect(errorSpy).toHaveBeenCalledWith("DynamoDB Query Error:", new Error('Service Error'));
    });
  });

});