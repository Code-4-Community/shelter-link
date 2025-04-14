import { Test, TestingModule } from '@nestjs/testing';
import { ShelterService } from '../../../backend/src/shelter/shelter.service';
import { DynamoDbService } from '../../../backend/src/dynamodb'; // Import your DynamoDB service
import { NewShelterInput } from 'backend/src/dtos/newShelterDTO';
import { ShelterUpdateModel } from 'backend/src/shelter/shelter.model';

const mockDynamoDB = {
  scanTable: jest.fn(),
  getHighestId: jest.fn(),
  postItem: jest.fn(),
  getItem: jest.fn(),
  deleteItem: jest.fn(),
  updateAttributes: jest.fn(),
};

const postReqSuccess: NewShelterInput = {
  name: 'Curry Student Center',
  address: {
    street: '360 Huntington Ave',
    city: 'Boston',
    state: 'MA',
    zipCode: '02115',
    country: 'United States',
  },
  latitude: 42.338925,
  longitude: -71.088128,
  description:
    'The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University',
  rating: 4.6,
  phone_number: '617-373-2000',
  email_address: 'cie@northeastern.edu',
  website: 'https://calendar.northeastern.edu/curry_student_center',
  hours: {
    Monday: { opening_time: '07:00', closing_time: '23:00' },
    Tuesday: null,
    Wednesday: { opening_time: '07:00', closing_time: '23:00' },
    Thursday: { opening_time: '07:00', closing_time: '23:00' },
    Friday: { opening_time: '07:00', closing_time: '23:00' },
    Saturday: { opening_time: '08:00', closing_time: '23:00' },
    Sunday: { opening_time: '10:00', closing_time: '23:00' },
  },
  picture: [
    'https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain',
    'https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg',
    'https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg',
  ],
  availability: '',
};

const postReqZeroFailure = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: 0,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: postReqSuccess.hours,
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postSubReqZeroFailure = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: -1,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: postReqSuccess.hours,
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postGreaterRatingFailure = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: 6,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: postReqSuccess.hours,
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postFiveRatingSuccess = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: 5,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: postReqSuccess.hours,
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqNegOpeningHour = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '-7:00', closing_time: '23:00' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqGreaterOpeningHour = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '30:00', closing_time: '50:00' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqNegClosingHour = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:00', closing_time: '-7:00' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqGreaterClosingHour = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:00', closing_time: '30:00' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqNegOpeningMinute = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:-1', closing_time: '23:00' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqGreaterOpeningMinute = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:60', closing_time: '23:00' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqNegClosingMinute = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:00', closing_time: '23:-1' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqGreaterClosingMinute = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:00', closing_time: '23:60' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqOpeningGreaterThanClosing = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '23:00', closing_time: '07:00' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqOpeningMisplacedColon = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '7:001', closing_time: '23:00' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqClosingMisplacedColon = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '05:00', closing_time: '7:001' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqOpeningNoColon = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '0007', closing_time: '23:00' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqClosingNoColon = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:00', closing_time: '0023' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqOpeningExtraChars = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:001', closing_time: '23:00' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqClosingExtraChars = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:00', closing_time: '23:001' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqOpeningTooShort = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:0', closing_time: '23:00' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqClosingTooShort = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:00', closing_time: '23:0' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqOpeningMinute59 = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:59', closing_time: '23:00' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
  tags: postReqSuccess.tags,
};

const postReqClosingMinute59 = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '07:00', closing_time: '23:59' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqOpeningHour23 = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '23:00', closing_time: '23:50' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postReqClosingHour23 = {
  name: postReqSuccess.name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  rating: postReqSuccess.rating,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: {
    Monday: { opening_time: '12:00', closing_time: '23:50' },
    Tuesday: postReqSuccess.hours.Tuesday,
    Wednesday: postReqSuccess.hours.Wednesday,
    Thursday: postReqSuccess.hours.Thursday,
    Friday: postReqSuccess.hours.Friday,
    Saturday: postReqSuccess.hours.Saturday,
    Sunday: postReqSuccess.hours.Sunday,
  },
  picture: postReqSuccess.picture,
  availability: postReqSuccess.availability,
};

const postDynamoDBReqBodySuccess = {
  shelterId: { S: '2' },
  name: { S: 'Curry Student Center' },
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
};

const postReqOpeningMinute59DynamoDB = {
  shelterId: postDynamoDBReqBodySuccess.shelterId,
  name: postDynamoDBReqBodySuccess.name,
  address: postDynamoDBReqBodySuccess.address,
  latitude: postDynamoDBReqBodySuccess.latitude,
  longitude: postDynamoDBReqBodySuccess.longitude,
  description: postDynamoDBReqBodySuccess.description,
  rating: postDynamoDBReqBodySuccess.rating,
  phone_number: postDynamoDBReqBodySuccess.phone_number,
  email_address: postDynamoDBReqBodySuccess.email_address,
  website: postDynamoDBReqBodySuccess.website,
  hours: {
    M: {
      Monday: {
        M: { opening_time: { S: '07:59' }, closing_time: { S: '23:00' } },
      },
      Tuesday: postDynamoDBReqBodySuccess.hours.M.Tuesday,
      Wednesday: postDynamoDBReqBodySuccess.hours.M.Wednesday,
      Thursday: postDynamoDBReqBodySuccess.hours.M.Thursday,
      Friday: postDynamoDBReqBodySuccess.hours.M.Friday,
      Saturday: postDynamoDBReqBodySuccess.hours.M.Saturday,
      Sunday: postDynamoDBReqBodySuccess.hours.M.Sunday,
    },
  },
  picture: postDynamoDBReqBodySuccess.picture,
  tags: postDynamoDBReqBodySuccess.tags,
};

const postReqClosingMinute59DynamoDB = {
    shelterId: postDynamoDBReqBodySuccess.shelterId,
    name: postDynamoDBReqBodySuccess.name,
    address: postDynamoDBReqBodySuccess.address,
    latitude: postDynamoDBReqBodySuccess.latitude,
    longitude: postDynamoDBReqBodySuccess.longitude,
    description: postDynamoDBReqBodySuccess.description,
    rating: postDynamoDBReqBodySuccess.rating,
    phone_number: postDynamoDBReqBodySuccess.phone_number,
    email_address: postDynamoDBReqBodySuccess.email_address,
    website: postDynamoDBReqBodySuccess.website,
    hours: {
      M: {
        Monday: {
          M: { opening_time: { S: '07:00' }, closing_time: { S: '23:59' } },
        },
        Tuesday: postDynamoDBReqBodySuccess.hours.M.Tuesday,
        Wednesday: postDynamoDBReqBodySuccess.hours.M.Wednesday,
        Thursday: postDynamoDBReqBodySuccess.hours.M.Thursday,
        Friday: postDynamoDBReqBodySuccess.hours.M.Friday,
        Saturday: postDynamoDBReqBodySuccess.hours.M.Saturday,
        Sunday: postDynamoDBReqBodySuccess.hours.M.Sunday,
      },
    },
    picture: postDynamoDBReqBodySuccess.picture,
    tags: postDynamoDBReqBodySuccess.tags,
};

const postReqOpeningHour23DynamoDB = {
    shelterId: postDynamoDBReqBodySuccess.shelterId,
    name: postDynamoDBReqBodySuccess.name,
    address: postDynamoDBReqBodySuccess.address,
    latitude: postDynamoDBReqBodySuccess.latitude,
    longitude: postDynamoDBReqBodySuccess.longitude,
    description: postDynamoDBReqBodySuccess.description,
    rating: postDynamoDBReqBodySuccess.rating,
    phone_number: postDynamoDBReqBodySuccess.phone_number,
    email_address: postDynamoDBReqBodySuccess.email_address,
    website: postDynamoDBReqBodySuccess.website,
    hours: {
      M: {
        Monday: {
          M: { opening_time: { S: '23:00' }, closing_time: { S: '23:50' } },
        },
        Tuesday: postDynamoDBReqBodySuccess.hours.M.Tuesday,
        Wednesday: postDynamoDBReqBodySuccess.hours.M.Wednesday,
        Thursday: postDynamoDBReqBodySuccess.hours.M.Thursday,
        Friday: postDynamoDBReqBodySuccess.hours.M.Friday,
        Saturday: postDynamoDBReqBodySuccess.hours.M.Saturday,
        Sunday: postDynamoDBReqBodySuccess.hours.M.Sunday,
      },
    },
    picture: postDynamoDBReqBodySuccess.picture,
    tags: postDynamoDBReqBodySuccess.tags,
};

const postReqClosingHour23DynamoDB = {
    shelterId: postDynamoDBReqBodySuccess.shelterId,
    name: postDynamoDBReqBodySuccess.name,
    address: postDynamoDBReqBodySuccess.address,
    latitude: postDynamoDBReqBodySuccess.latitude,
    longitude: postDynamoDBReqBodySuccess.longitude,
    description: postDynamoDBReqBodySuccess.description,
    rating: postDynamoDBReqBodySuccess.rating,
    phone_number: postDynamoDBReqBodySuccess.phone_number,
    email_address: postDynamoDBReqBodySuccess.email_address,
    website: postDynamoDBReqBodySuccess.website,
    hours: {
      M: {
        Monday: {
          M: { opening_time: { S: '12:00' }, closing_time: { S: '23:50' } },
        },
        Tuesday: postDynamoDBReqBodySuccess.hours.M.Tuesday,
        Wednesday: postDynamoDBReqBodySuccess.hours.M.Wednesday,
        Thursday: postDynamoDBReqBodySuccess.hours.M.Thursday,
        Friday: postDynamoDBReqBodySuccess.hours.M.Friday,
        Saturday: postDynamoDBReqBodySuccess.hours.M.Saturday,
        Sunday: postDynamoDBReqBodySuccess.hours.M.Sunday,
      },
    },
    picture: postDynamoDBReqBodySuccess.picture,
    tags: postDynamoDBReqBodySuccess.tags,
}

const postDynamoDBReqBodyFiveRatingSuccess = {
  shelterId: postDynamoDBReqBodySuccess.shelterId,
  name: postDynamoDBReqBodySuccess.name,
  address: postDynamoDBReqBodySuccess.address,
  latitude: postDynamoDBReqBodySuccess.latitude,
  longitude: postDynamoDBReqBodySuccess.longitude,
  description: postDynamoDBReqBodySuccess.description,
  phone_number: postDynamoDBReqBodySuccess.phone_number,
  email_address: postDynamoDBReqBodySuccess.email_address,
  hours: postDynamoDBReqBodySuccess.hours,
  picture: postDynamoDBReqBodySuccess.picture,
  rating: { N: '5' },
  website: postDynamoDBReqBodySuccess.website,
  tags: postDynamoDBReqBodySuccess.tags,
};

const postReturnSuccess = {
  $metadata: {
    httpStatusCode: 200,
    requestId: 'N1ME4EVFLIRR03DBC07449TFONVV4KQNSO5AEMVJF66Q9ASUAAJG',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0,
  },
  id: 2,
};

const getSheltersReqSuccessDynamoDB = [
  {
    shelterId: { S: '6' },
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
        Saturday: null,
        Sunday: null,
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
  },
  {
    shelterId: { S: '11' },
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
        Saturday: null,
        Sunday: null,
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
  },
];

const getSheltersReqSuccess = [
  {
    shelterId: '6',
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
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
      Saturday: null,
      Sunday: null,
    },
    picture: [
      'https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp',
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
  },
  {
    shelterId: '11',
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
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
      Saturday: null,
      Sunday: null,
    },
    picture: [
      'https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp',
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
  },
];

const getShelterReqSuccessDynamoDB = [
  {
    shelterId: { S: '6' },
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
        Saturday: null,
        Sunday: null,
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
  },
];

const getShelterReqSuccess = {
  shelterId: '6',
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
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
    Saturday: null,
    Sunday: null,
  },
  picture: [
    'https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp',
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
};

const deleteDynamoDBSuccess = {
  $metadata: {
    httpStatusCode: 200,
    requestId: '0099KTBH4F6FMEKPK5R0JGKOO7VV4KQNSO5AEMVJF66Q9ASUAAJG',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0,
  },
};

const updateShelterRequestSuccess: ShelterUpdateModel = {
  name: 'Curry Student Center',
  address: {
    street: '360 Huntington Ave',
    city: 'Boston',
    state: 'MA',
    zipCode: '02115',
    country: 'United States',
  },
  latitude: 42.338925,
  longitude: -71.088128,
  description:
    'The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University',
  rating: 4.6,
  phone_number: '617-373-2000',
  email_address: 'cie@northeastern.edu',
  website: 'https://calendar.northeastern.edu/curry_student_center',
  hours: {
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
    Tuesday: null,
  },
  picture: [
    'https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain',
    'https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg',
    'https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg',
  ],
};

const updateShelterRequestSuccessDynamoDb = {
  result: {
    $metadata: {
      httpStatusCode: 200,
      requestId: 'TB2BCGAGMNTSM0U9FONBES4G3BVV4KQNSO5AEMVJF66Q9ASUAAJG',
      attempts: 1,
      totalRetryDelay: 0,
    },
    Attributes: {
      website: {
        S: 'https://calendar.northeastern.edu/curry_student_center',
      },
      rating: {
        N: '4.6',
      },
      longitude: {
        N: '-71.088128',
      },
      phone_number: {
        S: '617-373-2000',
      },
      address: {
        M: {
          city: {
            S: 'Boston',
          },
          country: {
            S: 'United States',
          },
          state: {
            S: 'MA',
          },
          street: {
            S: '360 Huntington Ave',
          },
          zipCode: {
            S: '02115',
          },
        },
      },
      description: {
        S: 'The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University',
      },
      hours: {
        M: {
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
          Tuesday: {
            M: {
              closing_time: {
                S: '23:00',
              },
              opening_time: {
                S: '13:00',
              },
            },
          },
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
            S: 'https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jp',
          },
        ],
      },
      latitude: {
        N: '42.338925',
      },
      name: {
        S: 'Curry Student Center',
      },
      email_address: {
        S: 'cie@northeastern.edu',
      },
    },
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
  },
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
  Tuesday: null,
};

describe('ShelterService', () => {
  let service: ShelterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShelterService,
        {
          provide: DynamoDbService, // Mocking the dependency
          useValue: mockDynamoDB,
        },
      ],
    }).compile();

    service = module.get<ShelterService>(ShelterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('postShelter', () => {
    it('should successfully post a shelter', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postShelter(postReqSuccess);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodySuccess
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should correctly fail if dynamoDB returns an error for getHighestId', async () => {
      mockDynamoDB.getHighestId.mockRejectedValue(
        new Error('highest shelter id error')
      );
      await expect(service.postShelter(postReqSuccess)).rejects.toThrow(
        'highest shelter id error'
      );
      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
    });

    it('should correctly fail if dynamoDB returns an error for postItem', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockRejectedValue(
        new Error('dynamodb post item error')
      );
      await expect(service.postShelter(postReqSuccess)).rejects.toThrow(
        'dynamodb post item error'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodySuccess
      );
    });

    it('should reject an input with rating less than 0', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);

      await expect(service.postShelter(postSubReqZeroFailure)).rejects.toThrow(
        'Rating must be a number in the range (0, 5]'
      );
    });

    it('should reject an input with rating of 0', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);

      await expect(service.postShelter(postReqZeroFailure)).rejects.toThrow(
        'Rating must be a number in the range (0, 5]'
      );
    });

    it('should successfully post a shelter with rating of 5', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postShelter(postFiveRatingSuccess);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodyFiveRatingSuccess
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should reject an input with a rating of more than 5', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(2);

      await expect(
        service.postShelter(postGreaterRatingFailure)
      ).rejects.toThrow('Rating must be a number in the range (0, 5]');
    });

    it('should reject an input with a negative opening hour', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(service.postShelter(postReqNegOpeningHour)).rejects.toThrow(
        'Hours must be between 00:00 and 24:00 on Monday'
      );
    });

    it('should reject an input with opening hour greater than 23', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(
        service.postShelter(postReqGreaterOpeningHour)
      ).rejects.toThrow('Hours must be between 00:00 and 24:00 on Monday');
    });

    it('should reject an input with a negative closing hour', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(service.postShelter(postReqNegClosingHour)).rejects.toThrow(
        'Opening time must be before closing time on Monday'
      );
    });

    it('should reject an input with a closing hour greater than 23', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(
        service.postShelter(postReqGreaterClosingHour)
      ).rejects.toThrow('Hours must be between 00:00 and 24:00 on Monday');
    });

    it('should reject an input with a negative opening minute', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(
        service.postShelter(postReqNegOpeningMinute)
      ).rejects.toThrow('Hours must be between 00:00 and 24:00 on Monday');
    });

    it('should reject an input with an opening minute greater than 59', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(
        service.postShelter(postReqGreaterOpeningMinute)
      ).rejects.toThrow('Hours must be between 00:00 and 24:00 on Monday');
    });

    it('should reject an input with a negative closing minute', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(
        service.postShelter(postReqNegClosingMinute)
      ).rejects.toThrow('Hours must be between 00:00 and 24:00 on Monday');
    });

    it('should reject an input with a closing minute greater than 59', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(
        service.postShelter(postReqGreaterClosingMinute)
      ).rejects.toThrow('Hours must be between 00:00 and 24:00 on Monday');
    });

    it('should reject an input with valid individual times if the closing time is greater than opening time', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(
        service.postShelter(postReqOpeningGreaterThanClosing)
      ).rejects.toThrow('Opening time must be before closing time on Monday');
    });

    it('should reject a time with misplaced colon on opening time', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(
        service.postShelter(postReqOpeningMisplacedColon)
      ).rejects.toThrow('Hours must follow HH:MM format on Monday');
    });

    it('should reject a time with misplaced colon on closing time', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(
        service.postShelter(postReqClosingMisplacedColon)
      ).rejects.toThrow('Hours must follow HH:MM format on Monday');
    });

    it('should reject a time with no colon on opening time', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(service.postShelter(postReqOpeningNoColon)).rejects.toThrow(
        'Hours must follow HH:MM format on Monday'
      );
    });

    it('should reject at time with no colon on closing time', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(service.postShelter(postReqClosingNoColon)).rejects.toThrow(
        'Hours must follow HH:MM format on Monday'
      );
    });

    it('should reject an opening time that has extra characters (more than 5)', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(
        service.postShelter(postReqOpeningExtraChars)
      ).rejects.toThrow('Hours must follow HH:MM format on Monday');
    });

    it('should reject a closing time that has extra characters (more than 5)', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(
        service.postShelter(postReqClosingExtraChars)
      ).rejects.toThrow('Hours must follow HH:MM format on Monday');
    });

    it('should reject an opening time that is too short (less than 5)', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(service.postShelter(postReqOpeningTooShort)).rejects.toThrow(
        'Hours must follow HH:MM format on Monday'
      );
    });

    it('should reject a closing time that is too short (less than 5)', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);

      await expect(service.postShelter(postReqClosingTooShort)).rejects.toThrow(
        'Hours must follow HH:MM format on Monday'
      );
    });

    it('should accept an opening minute of 59', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postShelter(postReqOpeningMinute59);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postReqOpeningMinute59DynamoDB
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should accept a closing minute of 59', async () => {
        mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postShelter(postReqClosingMinute59);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postReqClosingMinute59DynamoDB
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should accept an opening hour of 23', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postShelter(postReqOpeningHour23);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postReqOpeningHour23DynamoDB
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should accept a closing hour of 23', async () => {
        mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postShelter(postReqClosingHour23);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postReqClosingHour23DynamoDB
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });
  });

  describe('getShelters', () => {
    it('should successfully get shelters', async () => {
      mockDynamoDB.scanTable.mockResolvedValue(getSheltersReqSuccessDynamoDB);

      const response = await service.getShelters();
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkShelters'
      );
      expect(response).toStrictEqual(getSheltersReqSuccess);
    });

    it('should correctly fail if DynamoDB returns an error for scanTable', async () => {
      mockDynamoDB.scanTable.mockRejectedValue(
        new Error('dynamodb scanTable error')
      );
      await expect(service.getShelters()).rejects.toThrow(
        'dynamodb scanTable error'
      );
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkShelters'
      );
    });
  });

  describe('getShelter', () => {
    it('should successfully get a shelter', async () => {
      mockDynamoDB.scanTable.mockResolvedValue(getShelterReqSuccessDynamoDB);

      const response = await service.getShelter('6');
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId = :shelterId',
        { ':shelterId': { S: '6' } }
      );
      expect(response).toStrictEqual(getShelterReqSuccess);
    });

    it('should correctly fail if DynamoDB returns an error for scanTable', async () => {
      mockDynamoDB.scanTable.mockRejectedValue(
        new Error('dynamodb scanTable error')
      );
      await expect(service.getShelter('6')).rejects.toThrow(
        'Unable to get shelter: Error: dynamodb scanTable error'
      );
      expect(mockDynamoDB.scanTable).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId = :shelterId',
        { ':shelterId': { S: '6' } }
      );
    });
  });

  describe('deleteShelter', () => {
    it('should successfully delete a shelter', async () => {
      mockDynamoDB.deleteItem.mockResolvedValue(deleteDynamoDBSuccess);
      const response = await service.deleteShelter('13');
      expect(mockDynamoDB.deleteItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        { shelterId: { S: '13' } }
      );
      expect(response).toStrictEqual(undefined);
    });

    it('should correctly fail if dynamoDB deleteItem returns an error', async () => {
      mockDynamoDB.deleteItem.mockRejectedValue(
        new Error('dynamodb deleteItem error')
      );
      await expect(service.deleteShelter('13')).rejects.toThrow(
        'Failed to delete shelter: dynamodb deleteItem error'
      );
      expect(mockDynamoDB.deleteItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        { shelterId: { S: '13' } }
      );
    });
  });

  describe('updateShelter', () => {
    it('should correctly update an entire shelter', async () => {
      mockDynamoDB.updateAttributes.mockResolvedValue(
        updateShelterRequestSuccessDynamoDb
      );
      const response = await service.updateShelter(
        '17',
        updateShelterRequestSuccess
      );
      expect(mockDynamoDB.updateAttributes).toHaveBeenCalledWith(
        'shelterlinkShelters',
        '17',
        updateShelterDynamoDbInput_buildAttributeNamesList,
        updateShelterDynamoDbInput_buildAttributeValuesList,
        updateShelterDynamoDbInput_HoursUpdateModel
      );
    });

    /*it('should correctly fail if dynamoDB updateAttributes returns an error', async () => {
            mockDynamoDB.updateAttributes.mockRejectedValue(new Error('dynamodb updateAttributes error'));
            await expect(service.updateShelter('10', updateShelterRequestSuccess))
                .rejects.toThrow('Error: Unable to update new shelter: Error: dynamodb updateAttributes error');
        });*/
  });
});
