import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserController } from '../../../backend/src/user/user.controller';
import { UserService } from '../../../backend/src/user/user.service';
import { NewUserInput } from '../../../backend/src/dtos/newUserDTO';
import { UserModel } from 'backend/src/user/user.model';
import { LoginUserRequest } from 'backend/src/types';

const user: UserModel = {
    userId: "1",
    first_name: "Sam",
    last_name: "Nie",
    email: "nie.sa@northeastern.edu",
    created_at: '2024-09-15T08:30:25',
};

const userInput: NewUserInput = {
    first_name: user.first_name,
    last_name: user.last_name,
    password: '12345678',
    email: user.email,
};


const shelterBookmark = {
    userId: "1",
    shelterId: "1",
    created_at: '2024-09-15T08:30:25'
}

const eventBookmark = {
    userId: "1",
    eventId: "1",
    created_at: '2024-09-15T08:30:25'
}

const loginUserRequest = {
    body: {
        email: 'nie.sa@northeastern.edu',
        password: '12345678',
    }
}

const bookmarkRequest = {
    body: {
        userId: '1',
        bookmarkId: '1',
    }
}


describe('UserController with mock UserService', () => {
    let app: INestApplication;

    let mockUserService: {
        postUser: jest.Mock<any, any>;
        getUsers: jest.Mock<any, any>;
        loginUser: jest.Mock<any, any>;
        postBookmark: jest.Mock<any, any>;
        deleteBookmark: jest.Mock<any, any>;
        getUserBookmarks: jest.Mock<any, any>;
    };

    beforeAll(async () => {
        mockUserService = {
            postUser: jest.fn(),
            getUsers: jest.fn(),
            loginUser: jest.fn(),
            postBookmark: jest.fn(),
            deleteBookmark: jest.fn(),
            getUserBookmarks: jest.fn(),
        };
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [{ provide: UserService, useValue: mockUserService }],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    afterEach(() => {
        jest.clearAllMocks(); // clears mock call history, return values, etc.
    });

    describe('POST /', () => {
        it('should post a user successfully', async () => {

            mockUserService.postUser.mockResolvedValue(user);

            const response = await request(app.getHttpServer())
                .post('/users')
                .send(userInput);

            expect(response.status).toBe(201);
            expect(mockUserService.postUser).toHaveBeenCalledWith(userInput);
            expect(response.body.message).toBe('User created successfully');
        });

        it('should fail to post a user if the service returns an error', async () => {
            mockUserService.postUser.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .post('/users')
                .send(userInput);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Unable to create user: Service Error');
        });
    });

    describe('POST /login', () => {
        it('should login a user successfully', async () => {
            mockUserService.loginUser.mockResolvedValue(user);

            const response = await request(app.getHttpServer())
                .post('/users/login')
                .send(loginUserRequest.body);

            expect(response.status).toBe(201);
            expect(mockUserService.loginUser).toHaveBeenCalledWith(loginUserRequest.body);
        });

        it('should fail to login a user if the service returns an error', async () => {
            mockUserService.loginUser.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .post('/users/login')
                .send(loginUserRequest.body);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Unable to login user: Service Error');
        });
    });

    describe('GET /', () => {
        it('should get users successfully', async () => {
            mockUserService.getUsers.mockResolvedValue([user]);

            const response = await request(app.getHttpServer())
                .get('/users')
                .send();

            expect(response.status).toBe(200);
            expect(mockUserService.getUsers).toHaveBeenCalledWith();
        });

        it('should fail to get users if the service returns an error', async () => {
            mockUserService.getUsers.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .get('/users')
                .send();

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Unable to get users: Service Error');
        });
    });

    describe('GET /bookmarks/:userId', () => {
        it("should get a users' shelter bookmarks successfully'", async () => {
            mockUserService.getUserBookmarks.mockResolvedValue([shelterBookmark]);

            const response = await request(app.getHttpServer())
                .get('/users/bookmarks/1')
                .send({ userId: '1' })
                .query({ type: 'shelter' });

            expect(response.status).toBe(200);
            expect(mockUserService.getUserBookmarks).toHaveBeenCalledWith('1', 'shelter');
        });

        it("should get a users' event bookmarks successfully'", async () => {
            mockUserService.getUserBookmarks.mockResolvedValue([eventBookmark]);

            const response = await request(app.getHttpServer())
                .get('/users/bookmarks/1')
                .send({ userId: '1' })
                .query({ type: 'event' });

            expect(response.status).toBe(200);
            expect(mockUserService.getUserBookmarks).toHaveBeenCalledWith('1', 'event');
        });

        it('should fail to get shelter bookmarks if the service returns an error', async () => {
            mockUserService.getUserBookmarks.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .get('/users/bookmarks/1')
                .send({ userId: '1' })
                .query({ type: 'shelter' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });


        it('should fail to get event bookmarks if the service returns an error', async () => {
            mockUserService.getUserBookmarks.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .get('/users/bookmarks/1')
                .send({ userId: '1' })
                .query({ type: 'event' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('POST /users/bookmarks/:type', () => {
        it("should post a shelter bookmark successfully", async () => {
            mockUserService.postBookmark.mockResolvedValue(shelterBookmark);

            const response = await request(app.getHttpServer())
                .post('/users/bookmarks/shelter')
                .send(bookmarkRequest);

            expect(response.status).toBe(201);
            expect(mockUserService.postBookmark).toHaveBeenCalledWith('1', '1', 'shelter');
        });

        it('should post an event bookmark successfully', async () => {
            mockUserService.postBookmark.mockResolvedValue(eventBookmark);

            const response = await request(app.getHttpServer())
                .post('/users/bookmarks/event')
                .send(bookmarkRequest);

            expect(response.status).toBe(201);
            expect(mockUserService.postBookmark).toHaveBeenCalledWith('1', '1', 'event');
        });

        it('should fail to post a shelter bookmark if the service returns an error', async () => {
            mockUserService.postBookmark.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .post('/users/bookmarks/shelter')
                .send(bookmarkRequest);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });

        it('should fail to post an event bookmark if the service returns an error', async () => {
            mockUserService.postBookmark.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .post('/users/bookmarks/event')
                .send(bookmarkRequest);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });

    describe('DELETE /users/bookmarks/:type', () => {
        it("should delete a shelter bookmark successfully", async () => {
            mockUserService.deleteBookmark.mockResolvedValue({ message: 'Bookmark deleted successfully' });

            const response = await request(app.getHttpServer())
                .delete('/users/bookmarks/shelter')
                .send(bookmarkRequest);

            expect(response.status).toBe(200);
            expect(mockUserService.deleteBookmark).toHaveBeenCalledWith('1', '1', 'shelter');
        });

        it("should delete an event bookmark successfully", async () => {
            mockUserService.deleteBookmark.mockResolvedValue({ message: 'Bookmark deleted successfully' });

            const response = await request(app.getHttpServer())
                .delete('/users/bookmarks/event')
                .send(bookmarkRequest);

            expect(response.status).toBe(200);
            expect(mockUserService.deleteBookmark).toHaveBeenCalledWith('1', '1', 'event');
        });

        it('should fail to delete a shelter bookmark if the service returns an error', async () => {
            mockUserService.deleteBookmark.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .delete('/users/bookmarks/shelter')
                .send(bookmarkRequest);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });

        it('should fail to delete an event bookmark if the service returns an error', async () => {
            mockUserService.deleteBookmark.mockRejectedValue(new Error('Service Error'));

            const response = await request(app.getHttpServer())
                .delete('/users/bookmarks/event')
                .send(bookmarkRequest);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });


});