import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { EventController } from '../../../backend/src/event/event.controller';
import { EventService } from '../../../backend/src/event/event.service';
import { NewEventInput } from '../../../backend/src/dtos/newEventDTO';

const mockEventService = {
  postEvent: jest.fn(),
  getEvents: jest.fn(),
  getEvent: jest.fn(),
};

// PostReqSuccess with all optional fields
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

const getReqSuccess = [
  {
    eventId: "1",
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
    eventId: "2",
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

const oneEvent = {
    eventId: "1",
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
}

const postReturnSuccess = {
    $metadata: {
        httpStatusCode: 200,
        requestId: '18I3TTSM5018GTL29UV9O48VENVV4KQNSO5AEMVJF66Q9ASUAAJG',
        attempts: 1,
        totalRetryDelay: 0,
    },
    id: 1,
};


describe('EventController with mock EventService', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [EventController],
            providers: [{ provide: EventService, useValue: mockEventService }],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

        describe('POST /', () => {
            it('should post an event successfully', async () => {
    
                mockEventService.postEvent.mockResolvedValue(postReturnSuccess);
    
                const response = await request(app.getHttpServer())
                    .post('/events')
                    .send(postReqSuccess);
    
                expect(response.status).toBe(201);
                expect(mockEventService.postEvent).toHaveBeenCalledWith(postReqSuccess);
            });
    
            it('should correctly fail if the service returns an Error', async () => {
                mockEventService.postEvent.mockRejectedValue(new Error('Service Error'));
    
                const response = await request(app.getHttpServer())
                    .post('/events')
                    .send();
    
                expect(response.status).toBe(500);
                expect(response.body.message).toBe('Internal server error');
            });
        });

        
            describe('GET /', () => {
                it('should get all events successfully', async () => {
                    mockEventService.getEvents.mockResolvedValue(getReqSuccess)
        
                    const response = await request(app.getHttpServer())
                        .get('/events')
                        .send();
        
                    expect(response.status).toBe(200);
                    expect(mockEventService.getEvents).toHaveBeenCalledWith();
                })
        
                it('should correctly fail if the service returns an Error', async () => {
                    mockEventService.getEvents.mockRejectedValue(new Error('Service Error'));
        
                    const response = await request(app.getHttpServer())
                        .get('/events')
                        .send();
        
                    expect(response.status).toBe(500);
                    expect(response.body.message).toBe('Internal server error');
                });
            })

            
                describe('GET /:eventId', () => {
                    it('should get a specific event successfully', async () => {
                        mockEventService.getEvent.mockResolvedValue(oneEvent)
            
                        const response = await request(app.getHttpServer())
                            .get('/events/3')
                            .send();
            
                        expect(response.status).toBe(200);
                        expect(mockEventService.getEvent).toHaveBeenCalledWith('3');
                    })
            
                    it('should correctly fail if the service returns an Error', async () => {
                        mockEventService.getEvent.mockRejectedValue(new Error('Service Error'));
            
                        const response = await request(app.getHttpServer())
                            .get('/events/3')
                            .send();
            
                        expect(response.status).toBe(500);
                        expect(response.body.message).toBe('Internal server error');
                    });
                })
});
