import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ShelterController } from '../../../backend/src/shelter/shelter.controller';
import { ShelterService } from '../../../backend/src/shelter/shelter.service';
import { NewShelterInput } from '../../../backend/src/dtos/newShelterDTO';

const mockShelterService = {
    postShelter: jest.fn(),
    getShelters: jest.fn(),
    getShelter: jest.fn(),
    deleteShelter: jest.fn(),
    updateShelter: jest.fn(),
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
        Monday: { opening_time: '07:00', closing_time: '24:00' },
        Tuesday: null,
        Wednesday: { opening_time: '07:00', closing_time: '24:00' },
        Thursday: { opening_time: '07:00', closing_time: '24:00' },
        Friday: { opening_time: '07:00', closing_time: '23:00' },
        Saturday: { opening_time: '08:00', closing_time: '23:00' },
        Sunday: { opening_time: '10:00', closing_time: '24:00' },
    },
    picture: [
        'https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain',
        'https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg',
        'https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg',
    ],
    availability: '',
};

const getReqSuccess = [
    {
        "shelterId": "6",
        "name": "BAGLY",
        "address": {
            "street": "123 Main St",
            "city": "Boston",
            "state": "MA",
            "zipCode": "02108",
            "country": ""
        },
        "latitude": 42.3586,
        "longitude": -71.180367,
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "phone_number": "555-0123",
        "email_address": "contact@shelter.org",
        "hours": {
            "Monday": {
                "opening_time": "06:00",
                "closing_time": "20:00"
            },
            "Tuesday": {
                "opening_time": "08:00",
                "closing_time": "20:00"
            },
            "Wednesday": {
                "opening_time": "08:00",
                "closing_time": "20:00"
            },
            "Thursday": {
                "opening_time": "06:00",
                "closing_time": "20:00"
            },
            "Friday": {
                "opening_time": "08:00",
                "closing_time": "20:00"
            },
            "Saturday": null,
            "Sunday": null
        },
        "picture": [
            "https://shelters-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp"
        ],
        "rating": 4.5,
        "website": "https://www.bagly.org/"
    },
    {
        "shelterId": "11",
        "name": "Curry Student Center",
        "address": {
            "street": "360 Huntington Ave",
            "city": "Boston",
            "state": "MA",
            "zipCode": "02115",
            "country": "United States"
        },
        "latitude": 42.338925,
        "longitude": -71.088128,
        "description": "The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University",
        "phone_number": "617-373-2000",
        "email_address": "cie@northeastern.edu",
        "hours": {
            "Monday": {
                "opening_time": "07:00",
                "closing_time": "24:00"
            },
            "Tuesday": null,
            "Wednesday": {
                "opening_time": "07:00",
                "closing_time": "24:00"
            },
            "Thursday": {
                "opening_time": "07:00",
                "closing_time": "24:00"
            },
            "Friday": {
                "opening_time": "07:00",
                "closing_time": "23:00"
            },
            "Saturday": {
                "opening_time": "08:00",
                "closing_time": "23:00"
            },
            "Sunday": {
                "opening_time": "10:00",
                "closing_time": "24:00"
            }
        },
        "picture": [
            "https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain",
            "https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg",
            "https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg"
        ],
        "rating": 4.6,
        "website": "https://calendar.northeastern.edu/curry_student_center"
    },
    {
        "shelterId": "3",
        "name": "Example Shelter 3",
        "address": {
            "street": "10 Test Ave.",
            "city": "New York",
            "state": "NY",
            "zipCode": "45678",
            "country": "USA"
        },
        "latitude": 89.5678,
        "longitude": -55.7893,
        "description": "Example description for this shelter.",
        "phone_number": "123-456-7890",
        "email_address": "contact@example.com",
        "hours": {
            "Monday": {
                "opening_time": "06:00",
                "closing_time": "20:00"
            },
            "Tuesday": {
                "opening_time": "08:00",
                "closing_time": "20:00"
            },
            "Wednesday": {
                "opening_time": "08:00",
                "closing_time": "20:00"
            },
            "Thursday": {
                "opening_time": "06:00",
                "closing_time": "20:00"
            },
            "Friday": {
                "opening_time": "08:00",
                "closing_time": "20:00"
            },
            "Saturday": null,
            "Sunday": null
        },
        "picture": [
            "https://shelters-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp"
        ],
        "rating": 4.2
    }
];

const oneShelter = {
    "shelterId": "3",
    "name": "Example Shelter 3",
    "address": {
        "street": "10 Test Ave.",
        "city": "New York",
        "state": "NY",
        "zipCode": "45678",
        "country": "USA"
    },
    "latitude": 89.5678,
    "longitude": -55.7893,
    "description": "Example description for this shelter.",
    "phone_number": "123-456-7890",
    "email_address": "contact@example.com",
    "hours": {
        "Monday": {
            "opening_time": "06:00",
            "closing_time": "20:00"
        },
        "Tuesday": {
            "opening_time": "08:00",
            "closing_time": "20:00"
        },
        "Wednesday": {
            "opening_time": "08:00",
            "closing_time": "20:00"
        },
        "Thursday": {
            "opening_time": "06:00",
            "closing_time": "20:00"
        },
        "Friday": {
            "opening_time": "08:00",
            "closing_time": "20:00"
        },
        "Saturday": null,
        "Sunday": null
    },
    "picture": [
        "https://shelters-link-shelters.s3.us-east-2.amazonaws.com/test_photo.webp"
    ],
    "rating": 4.2
}

const postReturnSuccess = {
    $metadata: {
        httpStatusCode: 200,
        requestId: '18I3TTSM5018GTL29UV9O48VENVV4KQNSO5AEMVJF66Q9ASUAAJG',
        attempts: 1,
        totalRetryDelay: 0,
    },
    id: 11,
};

const updateShelterReturnSuccess = {
    "result": {
        "$metadata": {
            "httpStatusCode": 200,
            "requestId": "IIPQO05DUEBENCG2IPK3QJEJMVVV4KQNSO5AEMVJF66Q9ASUAAJG",
            "attempts": 1,
            "totalRetryDelay": 0
        },
        "Attributes": {
            "website": {
                "S": "https://calendar.northeastern.edu/curry_student_center"
            },
            "rating": {
                "N": "4.6"
            },
            "longitude": {
                "N": "-71.088128"
            },
            "phone_number": {
                "S": "617-373-2000"
            },
            "address": {
                "M": {
                    "city": {
                        "S": "Boston"
                    },
                    "country": {
                        "S": "United States"
                    },
                    "state": {
                        "S": "MA"
                    },
                    "street": {
                        "S": "360 Huntington Ave"
                    },
                    "zipCode": {
                        "S": "02115"
                    }
                }
            },
            "description": {
                "S": "The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University"
            },
            "hours": {
                "M": {
                    "Friday": {
                        "M": {
                            "closing_time": {
                                "S": "23:00"
                            },
                            "opening_time": {
                                "S": "07:00"
                            }
                        }
                    },
                    "Monday": {
                        "M": {
                            "closing_time": {
                                "S": "24:00"
                            },
                            "opening_time": {
                                "S": "07:00"
                            }
                        }
                    },
                    "Saturday": {
                        "M": {
                            "closing_time": {
                                "S": "23:00"
                            },
                            "opening_time": {
                                "S": "08:00"
                            }
                        }
                    },
                    "Sunday": {
                        "M": {
                            "closing_time": {
                                "S": "24:00"
                            },
                            "opening_time": {
                                "S": "10:00"
                            }
                        }
                    },
                    "Thursday": {
                        "M": {
                            "closing_time": {
                                "S": "24:00"
                            },
                            "opening_time": {
                                "S": "07:00"
                            }
                        }
                    },
                    "Tuesday": {
                        "M": {
                            "closing_time": {
                                "S": "23:00"
                            },
                            "opening_time": {
                                "S": "13:00"
                            }
                        }
                    },
                    "Wednesday": {
                        "M": {
                            "closing_time": {
                                "S": "24:00"
                            },
                            "opening_time": {
                                "S": "07:00"
                            }
                        }
                    }
                }
            },
            "picture": {
                "L": [
                    {
                        "S": "https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain"
                    },
                    {
                        "S": "https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg"
                    },
                    {
                        "S": "https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jp"
                    }
                ]
            },
            "latitude": {
                "N": "42.338925"
            },
            "name": {
                "S": "Curry Student Center"
            },
            "email_address": {
                "S": "cie@northeastern.edu"
            }
        }
    }
}

const updateShelterRequestSuccess = {
    "shelterId": 10,
    "name": "Curry Student Center",
    "address": {
        "street": "360 Huntington Ave",
        "city": "Boston",
        "state": "MA",
        "zipCode": "02115",
        "country": "United States"
    },
    "latitude": 42.338925,
    "longitude": -71.088128,
    "description": "The John A. and Marcia E. Curry Student Center is the crossroads for community life at Northeastern University, serving all members of the University",
    "rating": 4.6,
    "phone_number": "617-373-2000",
    "email_address": "cie@northeastern.edu",
    "website": "https://calendar.northeastern.edu/curry_student_center",
    "hours": {
      "Monday": {
          "opening_time": "07:00",
          "closing_time": "24:00"
      },
      "Wednesday": {
          "opening_time": "07:00",
          "closing_time": "24:00"
      },
      "Thursday": {
          "opening_time": "07:00",
          "closing_time": "24:00"
      },
      "Friday": {
          "opening_time": "07:00",
          "closing_time": "23:00"
      },
      "Saturday": {
          "opening_time": "08:00",
          "closing_time": "23:00"
      },
      "Sunday": {
          "opening_time": "10:00",
          "closing_time": "24:00"
      }
    },
    "picture": ["https://th.bing.com/th/id/OIP.OqpRP8dl-udJN9VAHIiCUQHaE8?rs=1&pid=ImgDetMain", "https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd609234077806.56c3572f1b380.jpg", "https://www.pcadesign.com/wp-content/uploads/NU-Curry-Dining_5-1536x1114.jpg"]
  }

describe('ShelterController with mock ShelterService', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [ShelterController],
            providers: [{ provide: ShelterService, useValue: mockShelterService }],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /', () => {
        it('should post a shelter successfully', async () => {

            mockShelterService.postShelter.mockResolvedValue(postReturnSuccess);

            const response = await request(app.getHttpServer())
                .post('/shelters')
                .send(postReqSuccess);

            expect(response.status).toBe(201);
            expect(mockShelterService.postShelter).toHaveBeenCalledWith(postReqSuccess);
        });

        it('should correctly fail if the service returns an Error', async () => {
            mockShelterService.postShelter.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .post('/shelters')
                .send(postReqSuccess);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('GET /', () => {
        it('should get all shelters successfully', async () => {
            mockShelterService.getShelters.mockResolvedValue(getReqSuccess)

            const response = await request(app.getHttpServer())
                .get('/shelters')
                .send();

            expect(response.status).toBe(200);
            expect(mockShelterService.getShelters).toHaveBeenCalledWith();
        })

        it('should correctly fail if the service returns an Error', async () => {
            mockShelterService.getShelters.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .get('/shelters')
                .send();

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    })


    describe('GET /:shelterId', () => {
        it('should get a specific shelter successfully', async () => {
            mockShelterService.getShelter.mockResolvedValue(oneShelter)

            const response = await request(app.getHttpServer())
                .get('/shelters/3')
                .send();

            expect(response.status).toBe(200);
            expect(mockShelterService.getShelter).toHaveBeenCalledWith('3');
        })

        it('should correctly fail if the service returns an Error', async () => {
            mockShelterService.getShelter.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .get('/shelters/3')
                .send();

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    })

    describe('DELETE /:shelterId', () => {
        it('should delete a specific shelter successfully', async () => {
            mockShelterService.deleteShelter.mockResolvedValue(oneShelter)

            const response = await request(app.getHttpServer())
                .delete('/shelters/3')
                .send();

            expect(response.status).toBe(200);
            expect(mockShelterService.deleteShelter).toHaveBeenCalledWith('3');
        })

        it('should correctly fail if the service returns an Error', async () => {
            mockShelterService.deleteShelter.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .delete('/shelters/3')
                .send();

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('PATCH /update', () => {
        it('should update a specific shelter successfully', async () => {
            mockShelterService.updateShelter.mockResolvedValue(updateShelterReturnSuccess);
            const response = await request(app.getHttpServer())
                .patch('/shelters/update')
                .send(updateShelterRequestSuccess);
            
            expect(response.status).toBe(200);
            expect(mockShelterService.updateShelter).toHaveBeenCalledWith("update", updateShelterRequestSuccess);
        });

        it('should correctly fail if the service returns an Error', async () => {
            mockShelterService.updateShelter.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .patch('/shelters/update')
                .send(updateShelterRequestSuccess);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });
});



