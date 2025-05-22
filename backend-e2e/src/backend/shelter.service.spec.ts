import { Test, TestingModule } from '@nestjs/testing';
import { ShelterService } from '../../../backend/src/shelter/shelter.service';
import { DynamoDbService } from '../../../backend/src/dynamodb'; // Import your DynamoDB service
import { NewShelterInput } from 'backend/src/dtos/newShelterDTO';
import { ShelterUpdateModel } from 'backend/src/shelter/shelter.model';
import { NotFoundException } from '@nestjs/common/exceptions';

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const postReqSuccess: NewShelterInput = {
  name: 'Curry Student Center',
  expanded_name: 'Curry Student Center Northeastern University',
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

const postReqSuccessNoRating: NewShelterInput = {
  name: postReqSuccess.name,
  expanded_name: postReqSuccess.expanded_name,
  address: postReqSuccess.address,
  latitude: postReqSuccess.latitude,
  longitude: postReqSuccess.longitude,
  description: postReqSuccess.description,
  phone_number: postReqSuccess.phone_number,
  email_address: postReqSuccess.email_address,
  website: postReqSuccess.website,
  hours: postReqSuccess.hours,
  picture: postReqSuccess.picture,
  availability: '',
};



const postDynamoDBReqBodySuccess = {
  shelterId: { S: '2' },
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
    expanded_name: { S: 'Boston Alliance of Gay, Lesbian, Bisexual, and Transgender Youth' },
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
  {
    shelterId: { S: '7' },
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
    shelterId: { S: '8' },
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
  },

];

const getSheltersReqSuccess = [
  {
    shelterId: '6',
    name: 'BAGLY',
    expanded_name: 'Boston Alliance of Gay, Lesbian, Bisexual, and Transgender Youth',
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
      Saturday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
      Sunday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
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
  {
    shelterId: '7',
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
      Saturday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
      Sunday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
    },
    picture: [
      'https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp',
    ],
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
    shelterId: '8',
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
      Saturday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
      Sunday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
    },
    picture: [
      'https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp',
    ],
    rating: 4.5,
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
      Saturday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
      Sunday: {
        opening_time: '08:00',
        closing_time: '20:00',
      },
    },
    picture: [
      'https://shelter-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp',
    ],
    rating: 4.5,
    website: 'https://www.bagly.org/',
  },
];

const getShelterReqSuccessDynamoDB = [
  {
    shelterId: { S: '9' },
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
  shelterId: '9',
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
  },
  picture: [
    'https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain',
    'https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg',
    'https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg',
  ],
  tags: {
    'wheelchair_accessible': true,
    'pet_friendly': true,
    'family_friendly': true,
    'legal_aid': true,
    'lgbtq_focused': true,
    'mental_health_resources': true,
    'overnight_stay': true,
    'food_resources': true,
    'clothing_resources': true,
    'transportation_resources': true,
    'hygiene_facilities': true,
    'job_assistance': true,
    'medical_resources': true,
    'educational_programs': true,
    'substance_abuse_support': true,
  }
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
        clothing_resources: { BOOL: true },
        educational_programs: { BOOL: true },
        family_friendly: { BOOL: true },
        food_resources: { BOOL: true },
        hygiene_facilities: { BOOL: true },
        job_assistance: { BOOL: true },
        legal_aid: { BOOL: true },
        lgbtq_focused: { BOOL: true },
        medical_resources: { BOOL: true },
        mental_health_resources: { BOOL: true },
        overnight_stay: { BOOL: true },
        pet_friendly: { BOOL: true },
        substance_abuse_support: { BOOL: true },
        transportation_resources: { BOOL: true },
        wheelchair_accessible: { BOOL: true },
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
  true,
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

describe('ShelterService', () => {
  let service: ShelterService;

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

  afterEach(() => {
    jest.clearAllMocks(); // clears mock call history, return values, etc.
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

    it('should successfully post a shelter with all hours', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      let allHoursSuccess = deepClone(postReqSuccess);
      allHoursSuccess.hours.Tuesday = {
        opening_time: '13:00', closing_time: '23:00',
      }
      const response = await service.postShelter(allHoursSuccess);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postDynamoDBReqBodySuccessAllHours = deepClone(postDynamoDBReqBodySuccess);
      postDynamoDBReqBodySuccessAllHours.hours.M.Tuesday = {
        M: {
          opening_time: { S: '13:00' },
          closing_time: { S: '23:00' }
        }
      };
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodySuccessAllHours
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should successfully post a shelter with no hours', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      let noHoursSuccess = deepClone(postReqSuccess);
      noHoursSuccess.hours = {}
      const response = await service.postShelter(noHoursSuccess);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let noHoursSuccessDynamoDB = deepClone(postDynamoDBReqBodySuccess);
      noHoursSuccessDynamoDB.hours.M.Monday = null;
      noHoursSuccessDynamoDB.hours.M.Tuesday = null;
      noHoursSuccessDynamoDB.hours.M.Wednesday = null;
      noHoursSuccessDynamoDB.hours.M.Thursday = null;
      noHoursSuccessDynamoDB.hours.M.Friday = null;
      noHoursSuccessDynamoDB.hours.M.Saturday = null;
      noHoursSuccessDynamoDB.hours.M.Sunday = null;
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        noHoursSuccessDynamoDB
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should successfully post a shelter with no rating', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);
      let postReqNoRatingSuccess = deepClone(postReqSuccess);
      postReqNoRatingSuccess.rating = undefined;
      const response = await service.postShelter(postReqNoRatingSuccess);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postDynamoDBReqBodyNoRatingSuccess = deepClone(postDynamoDBReqBodySuccess);
      postDynamoDBReqBodyNoRatingSuccess.rating = undefined;
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodyNoRatingSuccess
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should successfully post a shelter with no website', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);
      let postReqNoWebsiteSuccess = deepClone(postReqSuccess);
      postReqNoWebsiteSuccess.website = undefined;
      const response = await service.postShelter(postReqNoWebsiteSuccess);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postDynamoDBReqBodyNoWebsiteSuccess = deepClone(postDynamoDBReqBodySuccess);
      postDynamoDBReqBodyNoWebsiteSuccess.website = undefined;
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodyNoWebsiteSuccess
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should successfully post a shelter with no expanded name', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);
      let postReqNoExpandedNameSuccess = deepClone(postReqSuccess);
      postReqNoExpandedNameSuccess.expanded_name = undefined;
      const response = await service.postShelter(postReqNoExpandedNameSuccess);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postDynamoDBReqBodyNoExpandedNameSuccess = deepClone(postDynamoDBReqBodySuccess);
      postDynamoDBReqBodyNoExpandedNameSuccess.expanded_name = undefined;
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodyNoExpandedNameSuccess
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should post a shelter with no country to dynamodb if the country is empty', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      let postReqNoCountrySuccess = deepClone(postReqSuccess);
      postReqNoCountrySuccess.address.country = undefined;
      const response = await service.postShelter(postReqNoCountrySuccess);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postDynamoDBReqBodyNoCountrySuccess = deepClone(postDynamoDBReqBodySuccess);
      postDynamoDBReqBodyNoCountrySuccess.address.M.country.S = '';
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodyNoCountrySuccess
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should correctly fail if dynamoDB returns an error for getHighestId', async () => {
      mockDynamoDB.getHighestId.mockRejectedValue(
        new Error('highest shelter id error')
      );
      await expect(service.postShelter(postReqSuccess)).rejects.toThrow(new Error(
        'highest shelter id error'
      ));
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
      await expect(service.postShelter(postReqSuccess)).rejects.toThrow(new Error(
        'dynamodb post item error'
      ));
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodySuccess
      );
    });

    it('should reject an input with rating less than 0', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      let postSubReqZeroFailure = deepClone(postReqSuccess);
      postSubReqZeroFailure.rating = -1;

      await expect(service.postShelter(postSubReqZeroFailure)).rejects.toThrow(new Error(
        'Rating must be a number in the range (0, 5]'
      ));
    });

    it('should reject an input with rating of 0', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      let postReqZeroFailure = deepClone(postReqSuccess);
      postReqZeroFailure.rating = 0;

      await expect(service.postShelter(postReqZeroFailure)).rejects.toThrow(new Error(
        'Rating must be a number in the range (0, 5]'
      ));
    });

    it('should successfully post a shelter with rating of 5', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);
      let postFiveRatingSuccess = deepClone(postReqSuccess);
      postFiveRatingSuccess.rating = 5;

      const response = await service.postShelter(postFiveRatingSuccess);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postDynamoDBReqBodyFiveRatingSuccess = deepClone(postDynamoDBReqBodySuccess);
      postDynamoDBReqBodyFiveRatingSuccess.rating.N = '5';
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodyFiveRatingSuccess
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should reject an input with a rating of more than 5', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(2);
      let postGreaterRatingFailure = deepClone(postReqSuccess);
      postGreaterRatingFailure.rating = 6;

      await expect(
        service.postShelter(postGreaterRatingFailure)
      ).rejects.toThrow(new Error('Rating must be a number in the range (0, 5]'));
    });

    it('should reject an input with a negative opening hour', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqNegOpeningHour = deepClone(postReqSuccess);
      postReqNegOpeningHour.hours.Monday.opening_time = '-7:00';
      await expect(service.postShelter(postReqNegOpeningHour)).rejects.toThrow(new Error(
        'Hours must be between 00:00 and 24:00 on Monday'
      ));
    });

    it('should accept an input with an opening hour of 0', async () => {
      let postReqZeroOpeningHour = deepClone(postReqSuccess);
      postReqZeroOpeningHour.hours.Monday.opening_time = '00:00';
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postShelter(postReqZeroOpeningHour);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postDynamoDBReqBodyZeroOpeningHour = deepClone(postDynamoDBReqBodySuccess);
      postDynamoDBReqBodyZeroOpeningHour.hours.M.Monday.M.opening_time.S = '00:00';
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodyZeroOpeningHour
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should reject an input with opening hour greater than 23', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqGreaterOpeningHour = deepClone(postReqSuccess);
      postReqGreaterOpeningHour.hours.Monday.opening_time = '30:00';
      postReqGreaterOpeningHour.hours.Monday.closing_time = '50:00';

      await expect(
        service.postShelter(postReqGreaterOpeningHour)
      ).rejects.toThrow(new Error('Hours must be between 00:00 and 24:00 on Monday'));
    });

    it('should reject an input with a negative closing hour', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqNegClosingHour = deepClone(postReqSuccess);
      postReqNegClosingHour.hours.Monday.closing_time = '-7:00';

      await expect(service.postShelter(postReqNegClosingHour)).rejects.toThrow(new Error(
        'Opening time must be before closing time on Monday'
      ));
    });

    it('should accept an input with a closing hour of 0', async () => {
      let postReqZeroOpeningHour = deepClone(postReqSuccess);
      postReqZeroOpeningHour.hours.Monday.opening_time = '00:00';
      postReqZeroOpeningHour.hours.Monday.closing_time = '00:50';

      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);

      const response = await service.postShelter(postReqZeroOpeningHour);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postDynamoDBReqBodyZeroOpeningHour = deepClone(postDynamoDBReqBodySuccess);
      postDynamoDBReqBodyZeroOpeningHour.hours.M.Monday.M.opening_time.S = '00:00';
      postDynamoDBReqBodyZeroOpeningHour.hours.M.Monday.M.closing_time.S = '00:50';
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postDynamoDBReqBodyZeroOpeningHour
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should reject an input with a closing hour greater than 23', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqGreaterClosingHour = deepClone(postReqSuccess);
      postReqGreaterClosingHour.hours.Monday.closing_time = '30:00';

      await expect(
        service.postShelter(postReqGreaterClosingHour)
      ).rejects.toThrow(new Error('Hours must be between 00:00 and 24:00 on Monday'));
    });

    it('should reject an input with a negative opening minute', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqNegOpeningMinute = deepClone(postReqSuccess);
      postReqNegOpeningMinute.hours.Monday.opening_time = '07:-1';

      await expect(
        service.postShelter(postReqNegOpeningMinute)
      ).rejects.toThrow(new Error('Hours must be between 00:00 and 24:00 on Monday'));
    });

    it('should reject an input with an opening minute greater than 59', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqGreaterOpeningMinute = deepClone(postReqSuccess);
      postReqGreaterOpeningMinute.hours.Monday.opening_time = '07:60';

      await expect(
        service.postShelter(postReqGreaterOpeningMinute)
      ).rejects.toThrow(new Error('Hours must be between 00:00 and 24:00 on Monday'));
    });

    it('should reject an input with a negative closing minute', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqNegClosingMinute = deepClone(postReqSuccess);
      postReqNegClosingMinute.hours.Monday.closing_time = '23:-1';

      await expect(
        service.postShelter(postReqNegClosingMinute)
      ).rejects.toThrow(new Error('Hours must be between 00:00 and 24:00 on Monday'));
    });

    it('should reject an input with a closing minute greater than 59', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqGreaterClosingMinute = deepClone(postReqSuccess);
      postReqGreaterClosingMinute.hours.Monday.closing_time = '23:60';

      await expect(
        service.postShelter(postReqGreaterClosingMinute)
      ).rejects.toThrow(new Error('Hours must be between 00:00 and 24:00 on Monday'));
    });

    it('should reject an input with valid individual times if the closing time is greater than opening time', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqOpeningGreaterThanClosing = deepClone(postReqSuccess);
      postReqOpeningGreaterThanClosing.hours.Monday.opening_time = '20:00';
      postReqOpeningGreaterThanClosing.hours.Monday.closing_time = '06:00';

      await expect(
        service.postShelter(postReqOpeningGreaterThanClosing)
      ).rejects.toThrow(new Error('Opening time must be before closing time on Monday'));
    });

    it('should reject a time with misplaced colon on opening time', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqOpeningMisplacedColon = deepClone(postReqSuccess);
      postReqOpeningMisplacedColon.hours.Monday.opening_time = '7:001';

      await expect(
        service.postShelter(postReqOpeningMisplacedColon)
      ).rejects.toThrow(new Error('Hours must follow HH:MM format on Monday'));
    });

    it('should reject a time with misplaced colon on closing time', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqClosingMisplacedColon = deepClone(postReqSuccess);
      postReqClosingMisplacedColon.hours.Monday.opening_time = '05:00';
      postReqClosingMisplacedColon.hours.Monday.closing_time = '7:001';

      await expect(
        service.postShelter(postReqClosingMisplacedColon)
      ).rejects.toThrow(new Error('Hours must follow HH:MM format on Monday'));
    });

    it('should reject a time with no colon on opening time', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqOpeningNoColon = deepClone(postReqSuccess);
      postReqOpeningNoColon.hours.Monday.opening_time = '0007';

      await expect(service.postShelter(postReqOpeningNoColon)).rejects.toThrow(new Error(
        'Hours must follow HH:MM format on Monday'
      ));
    });

    it('should reject at time with no colon on closing time', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqClosingNoColon = deepClone(postReqSuccess);
      postReqClosingNoColon.hours.Monday.closing_time = '0023';

      await expect(service.postShelter(postReqClosingNoColon)).rejects.toThrow(new Error(
        'Hours must follow HH:MM format on Monday'
      ));
    });

    it('should reject an opening time that has extra characters (more than 5)', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqOpeningExtraChars = deepClone(postReqSuccess);
      postReqOpeningExtraChars.hours.Monday.opening_time = '07:001';

      await expect(
        service.postShelter(postReqOpeningExtraChars)
      ).rejects.toThrow(new Error('Hours must follow HH:MM format on Monday'));
    });

    it('should reject a closing time that has extra characters (more than 5)', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqClosingExtraChars = deepClone(postReqSuccess);
      postReqClosingExtraChars.hours.Monday.closing_time = '23:001';

      await expect(
        service.postShelter(postReqClosingExtraChars)
      ).rejects.toThrow(new Error('Hours must follow HH:MM format on Monday'));
    });

    it('should reject an opening time that is too short (less than 5)', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqOpeningTooShort = deepClone(postReqSuccess);
      postReqOpeningTooShort.hours.Monday.opening_time = '07:0';

      await expect(service.postShelter(postReqOpeningTooShort)).rejects.toThrow(new Error(
        'Hours must follow HH:MM format on Monday'
      ));
    });

    it('should reject a closing time that is too short (less than 5)', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqClosingTooShort = deepClone(postReqSuccess);
      postReqClosingTooShort.hours.Monday.closing_time = '23:0';

      await expect(service.postShelter(postReqClosingTooShort)).rejects.toThrow(new Error(
        'Hours must follow HH:MM format on Monday'
      ));
    });

    it('should accept an opening minute of 59', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);
      let postReqOpeningMinute59 = deepClone(postReqSuccess);
      postReqOpeningMinute59.hours.Monday.opening_time = '07:59';

      const response = await service.postShelter(postReqOpeningMinute59);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postReqOpeningMinute59DynamoDB = deepClone(postDynamoDBReqBodySuccess);
      postReqOpeningMinute59DynamoDB.hours.M.Monday.M.opening_time.S = '07:59';
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postReqOpeningMinute59DynamoDB
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should accept a closing minute of 59', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);
      let postReqClosingMinute59 = deepClone(postReqSuccess);
      postReqClosingMinute59.hours.Monday.closing_time = '23:59';

      const response = await service.postShelter(postReqClosingMinute59);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postReqClosingMinute59DynamoDB = deepClone(postDynamoDBReqBodySuccess);
      postReqClosingMinute59DynamoDB.hours.M.Monday.M.closing_time.S = '23:59';
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postReqClosingMinute59DynamoDB
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should accept an opening hour of 23', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);
      let postReqOpeningHour23 = deepClone(postReqSuccess);
      postReqOpeningHour23.hours.Monday.opening_time = '23:00';
      postReqOpeningHour23.hours.Monday.closing_time = '23:01';

      const response = await service.postShelter(postReqOpeningHour23);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postReqOpeningHour23DynamoDB = deepClone(postDynamoDBReqBodySuccess);
      postReqOpeningHour23DynamoDB.hours.M.Monday.M.opening_time.S = '23:00';
      postReqOpeningHour23DynamoDB.hours.M.Monday.M.closing_time.S = '23:01';
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postReqOpeningHour23DynamoDB
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should accept a closing hour of 23', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);
      let postReqClosingHour23 = deepClone(postReqSuccess);
      postReqClosingHour23.hours.Monday.opening_time = '22:00';
      postReqClosingHour23.hours.Monday.closing_time = '23:00';

      const response = await service.postShelter(postReqClosingHour23);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postReqClosingHour23DynamoDB = deepClone(postDynamoDBReqBodySuccess);
      postReqClosingHour23DynamoDB.hours.M.Monday.M.opening_time.S = '22:00';
      postReqClosingHour23DynamoDB.hours.M.Monday.M.closing_time.S = '23:00';
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postReqClosingHour23DynamoDB
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should accept a closing and opening when the hour is the same but the opening minute is less than the closing minute', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);
      let postReqClosingHour23 = deepClone(postReqSuccess);
      postReqClosingHour23.hours.Monday.opening_time = '23:01';
      postReqClosingHour23.hours.Monday.closing_time = '23:02';

      const response = await service.postShelter(postReqClosingHour23);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let postReqClosingHour23DynamoDB = deepClone(postDynamoDBReqBodySuccess);
      postReqClosingHour23DynamoDB.hours.M.Monday.M.opening_time.S = '23:01';
      postReqClosingHour23DynamoDB.hours.M.Monday.M.closing_time.S = '23:02';
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        postReqClosingHour23DynamoDB
      );
      expect(response).toStrictEqual(postReturnSuccess);
    });

    it('should reject a closing and opening time when the hour is the same and the opening minute is equal to the closing minute', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqOpeningTooShort = deepClone(postReqSuccess);
      postReqOpeningTooShort.hours.Monday.opening_time = '07:01';
      postReqOpeningTooShort.hours.Monday.closing_time = '07:01';


      await expect(service.postShelter(postReqOpeningTooShort)).rejects.toThrow(new Error(
        'Opening time must be before closing time on Monday'
      ));
    });


    it('should reject a closing and opening when the hour is the same but the opening minute is greater than the closing minute', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(5);
      let postReqOpeningTooShort = deepClone(postReqSuccess);
      postReqOpeningTooShort.hours.Monday.opening_time = '07:40';
      postReqOpeningTooShort.hours.Monday.closing_time = '07:30';

      await expect(service.postShelter(postReqOpeningTooShort)).rejects.toThrow(new Error(
        'Opening time must be before closing time on Monday'
      ));
    });

    it('should accept an input even if the a day is missing hours', async () => {
      mockDynamoDB.getHighestId.mockResolvedValue(1);
      mockDynamoDB.postItem.mockResolvedValue(postReturnSuccess);
      let missingHour = deepClone(postReqSuccess);
      missingHour.hours.Monday = null;

      const response = await service.postShelter(missingHour);

      expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith(
        'shelterlinkShelters',
        'shelterId'
      );
      let missingHourDynamoDB = deepClone(postDynamoDBReqBodySuccess);
      missingHourDynamoDB.hours.M.Monday = null;
      expect(mockDynamoDB.postItem).toHaveBeenCalledWith(
        'shelterlinkShelters',
        missingHourDynamoDB
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
      await expect(service.getShelters()).rejects.toThrow(new Error(
        'Unable to get shelters: Error: dynamodb scanTable error'
      ));
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
      await expect(service.getShelter('6')).rejects.toThrow(new Error(
        'Unable to get shelter: Error: dynamodb scanTable error'
      ));
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
      await expect(service.deleteShelter('13')).rejects.toThrow(new Error(
        'Failed to delete shelter: dynamodb deleteItem error'
      ));
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
        updateShelterDynamoDbInput_HoursUpdateModel,
      );
      expect(response).toEqual({ result: updateShelterRequestSuccessDynamoDb });
    });

    it('should not be able to change a shelter id', async () => {
      mockDynamoDB.updateAttributes.mockResolvedValue(
        updateShelterRequestSuccessDynamoDb
      );
      let updateShelterRequestSuccessWithId = deepClone(updateShelterRequestSuccess);
      updateShelterRequestSuccessWithId.shelterId = '21';
      const response = await service.updateShelter(
        '17',
        updateShelterRequestSuccessWithId
      );
      expect(mockDynamoDB.updateAttributes).toHaveBeenCalledWith(
        'shelterlinkShelters',
        '17',
        updateShelterDynamoDbInput_buildAttributeNamesList,
        updateShelterDynamoDbInput_buildAttributeValuesList,
        updateShelterDynamoDbInput_HoursUpdateModel,
      );
      expect(response).toEqual({ result: updateShelterRequestSuccessDynamoDb });
    });

    it('should correctly fail if dynamoDB updateAttributes returns an error', async () => {
      mockDynamoDB.updateAttributes.mockRejectedValue(new Error('dynamodb updateAttributes error'));
      await expect(service.updateShelter('10', updateShelterRequestSuccess))
        .rejects.toThrow(new Error('Unable to update new shelter: Error: dynamodb updateAttributes error'));
    });

    it('should throw not found exception if DynamoDB returns not found exception', async () => {
      mockDynamoDB.updateAttributes.mockRejectedValue(new NotFoundException('not found'));
      await expect(service.updateShelter('10', updateShelterRequestSuccess))
        .rejects.toThrow(new NotFoundException('not found'));
    });
  });
});
