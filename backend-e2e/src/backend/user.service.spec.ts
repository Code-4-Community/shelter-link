import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../backend/src/user/user.service';
import { DynamoDbService } from '../../../backend/src/dynamodb'; // Import your DynamoDB service
import { NewUserInput } from '../../../backend/src/dtos/newUserDTO';
import { UserModel } from '../../../backend/src/user/user.model';
import { LoginUserRequest, UserRole } from '../../../backend/src/types';
import { AdminConfirmSignUpCommand, CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';
import { ExceptionOptionType } from '@smithy/smithy-client/dist-types';
import { NotFoundException } from '@nestjs/common/exceptions';

const logSpy = jest.spyOn(global.console, 'log');


const mockCognitoClient = {
    send: jest.fn(),
};


const user: UserModel = {
    userId: "1",
    first_name: "Sam",
    last_name: "Nie",
    role: "USER",
    email: "nie.sa@northeastern.edu",
    created_at: '2024-09-15T08:30:25',
};

const dynamodbUser = {
    userId: { S: "1" },
    first_name: { S: "Sam" },
    last_name: { S: "Nie" },
    email: { S: "nie.sa@northeastern.edu" },
    created_at: { S: '2024-09-15T08:30:25' },
};

const userInput: NewUserInput = {
    first_name: user.first_name,
    last_name: user.last_name,
    password: '12345678',
    email: user.email,
};

const loginUserRequest = {
    body: {
        email: 'nie.sa@northeastern.edu',
        password: '12345678',
    }
} as LoginUserRequest


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

const dynamoDBShelterBookmark = {
    item: {
        userId: { S: "1" },
        shelterId: { S: "1" },
        created_at: { S: '2024-09-15T08:30:25' }
    }
}

const dynamoDBEventBookmark = {
    item: {
        userId: { S: "1" },
        eventId: { S: "1" },
        created_at: { S: '2024-09-15T08:30:25' }
    }
}

const postUserSucces = {
    userId: '1',
    first_name: userInput.first_name,
    last_name: userInput.last_name,
    email: userInput.email,
    created_at: new Date().toISOString(),
    role: UserRole.USER, // Default to USER role
};

describe('UserService', () => {
    let service: UserService;

    let mockDynamoDB: {
        scanTable: jest.Mock<any, any>;
        getHighestId: jest.Mock<any, any>;
        postItem: jest.Mock<any, any>;
        getItem: jest.Mock<any, any>;
        deleteItem: jest.Mock<any, any>;
        updateAttributes: jest.Mock<any, any>;
        queryTable: jest.Mock<any, any>;
    };

    beforeEach(async () => {
        mockDynamoDB = {
            scanTable: jest.fn(),
            getHighestId: jest.fn(),
            postItem: jest.fn(),
            getItem: jest.fn(),
            deleteItem: jest.fn(),
            updateAttributes: jest.fn(),
            queryTable: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: DynamoDbService, // Mocking the dependency
                    useValue: mockDynamoDB,
                },
                {
                    provide: CognitoIdentityProviderClient,
                    useValue: mockCognitoClient,
                }
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks(); // clears mock call history, return values, etc.
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('postUser', () => {
        it('should post a user successfully', async () => {
            mockDynamoDB.postItem.mockResolvedValue('shelterlinkUsers');
            mockCognitoClient.send.mockResolvedValue('nie.sa@northeastern.edu');

            const response = await service.postUser(userInput);
            expect(response).toEqual(expect.objectContaining({
                userId: '1',
                first_name: userInput.first_name,
                last_name: userInput.last_name,
                email: userInput.email,
                role: UserRole.USER,
                created_at: expect.any(String),
            }));
            expect(mockDynamoDB.postItem).toHaveBeenCalledWith('shelterlinkUsers',
                expect.objectContaining({
                    userId: { S: '1' },
                    first_name: { S: userInput.first_name },
                    last_name: { S: userInput.last_name },
                    email: { S: userInput.email },
                    role: { S: UserRole.USER },
                    created_at: { S: expect.any(String) },
                })
            );
            expect(mockDynamoDB.getHighestId).toHaveBeenCalledWith('shelterlinkUsers', 'userId');
            const call = mockCognitoClient.send.mock.calls[0][0];
            expect(call).toBeInstanceOf(SignUpCommand);
            expect(call.input).toEqual(expect.objectContaining({
                Username: 'nie.sa@northeastern.edu',
                Password: '12345678',
                UserAttributes: [
                    {
                        Name: 'email',
                        Value: 'nie.sa@northeastern.edu',
                    },
                    {
                        Name: 'given_name',
                        Value: 'Sam',
                    },
                    {
                        Name: 'family_name',
                        Value: 'Nie',
                    },
                ],
            }));
            const call2 = mockCognitoClient.send.mock.calls[1][0];
            expect(call2).toBeInstanceOf(AdminConfirmSignUpCommand);
            expect(call2.input).toEqual(expect.objectContaining({
                Username: 'nie.sa@northeastern.edu',
            }));

        });

        it('should throw an error if Cognito fails with an error that is not an instance of UsernameExistsException', async () => {
            mockCognitoClient.send.mockRejectedValue(new Error('Cognito error'));

            await expect(service.postUser(userInput)).rejects.toThrow(new Error('Error creating Cognito user: Error: Cognito error'));
        });

        it('should throw an error if Cognito fails with UsernameExistsException', async () => {
            // Mock the Cognito error to be an instance of UsernameExistsException
            mockCognitoClient.send.mockRejectedValue(new UsernameExistsException('type' as ExceptionOptionType<any, any>));

            await expect(service.postUser(userInput)).rejects.toThrow(new Error('User already exists with this email. Please use a different email.'));
            expect(logSpy).toHaveBeenCalledWith('User already exists with this email: nie.sa@northeastern.edu');
        });

        it('should throw an error id DynamoDB getHighestId fails', async () => {
            mockDynamoDB.getHighestId.mockRejectedValue(new Error('DynamoDB error'));
            mockCognitoClient.send.mockResolvedValue('nie.sa@northeastern.edu');


            await expect(service.postUser(userInput)).rejects.toThrow(new Error('DynamoDB error'));
        });

        it('should throw an error if DynamoDB postItem fails', async () => {
            mockDynamoDB.postItem.mockRejectedValue(new Error('DynamoDB error'));
            mockCognitoClient.send.mockResolvedValue('nie.sa@northeastern.edu');
            await expect(service.postUser(userInput)).rejects.toThrow(new Error('DynamoDB error'));
        });

    });

    describe('getUsers', () => {
        it('should get users successfully', async () => {
            mockDynamoDB.scanTable.mockResolvedValue([dynamodbUser]);

            const response = await service.getUsers();
            expect(response).toEqual([user]);
            expect(mockDynamoDB.scanTable).toHaveBeenCalledWith('shelterlinkUsers');
        });

        it('should throw an error if DynamoDB scanTable fails', async () => {
            mockDynamoDB.scanTable.mockRejectedValue(new Error('DynamoDB error'));

            await expect(service.getUsers()).rejects.toThrow(new Error("Unable to get users: Error: DynamoDB error"));
        });
    });

    describe('loginUser', () => {
        it('should login a user successfully', async () => {
            mockCognitoClient.send.mockResolvedValue(true);
            mockDynamoDB.queryTable.mockResolvedValue([dynamodbUser]);

            const response = await service.loginUser(loginUserRequest);
            expect(response).toEqual(user);
            const call = mockCognitoClient.send.mock.calls[0][0];
            expect(call).toBeInstanceOf(InitiateAuthCommand);
            expect(call.input).toEqual({
                ClientId: process.env.COGNITO_CLIENT_ID,
                AuthFlow: 'USER_PASSWORD_AUTH' as const,
                AuthParameters: {
                    USERNAME: 'nie.sa@northeastern.edu',
                    PASSWORD: '12345678',
                }
            });
            expect(mockDynamoDB.queryTable).toHaveBeenCalledWith(
                'shelterlinkUsers',
                'email = :email',
                { ':email': { S: 'nie.sa@northeastern.edu' } },
                'email-index');
        });

        it('should throw an error if DynamoDB queryTable can\'t find the user', async () => {
            mockCognitoClient.send.mockResolvedValue('nie.sa@northeastern.edu');
            mockDynamoDB.queryTable.mockResolvedValue([]);

            await expect(service.loginUser(loginUserRequest)).rejects.toThrow(new Error('User not found'));
        });

        it('should throw an error if Cognito fails', async () => {
            mockCognitoClient.send.mockRejectedValue(new Error('Cognito error'));

            await expect(service.loginUser(loginUserRequest)).rejects.toThrow(new Error('Error: Cognito error'));
        });
    });

    describe('postBookmark', () => {
        it('should post a shelter bookmark successfully', async () => {
            mockDynamoDB.postItem.mockResolvedValue(true);
            mockDynamoDB.queryTable.mockResolvedValue([dynamoDBShelterBookmark]);
            const response = await service.postBookmark('1', '1', 'shelter');

            expect(response).toEqual(expect.objectContaining({
                message: 'Bookmark created successfully',
                bookmark: {
                    userId: shelterBookmark.userId,
                    shelterId: shelterBookmark.shelterId,
                    created_at: expect.any(String),
                }
            }));

            expect(mockDynamoDB.postItem).toHaveBeenCalledWith('shelterlinkShelterBookmarks', expect.objectContaining({
                userId: { S: "1" },
                shelterId: { S: "1" },
                created_at: { S: expect.any(String) }
            })
            );
            expect(mockDynamoDB.queryTable).toHaveBeenCalledWith(
                'shelterlinkShelters',
                `shelterId = :bookmarkId`,
                { ':bookmarkId': { S: '1' } }
            );
        });

        it('should post an event bookmark successfully', async () => {
            mockDynamoDB.postItem.mockResolvedValue(true);
            mockDynamoDB.queryTable.mockResolvedValue([dynamoDBEventBookmark]);
            const response = await service.postBookmark('1', '1', 'event');

            expect(response).toEqual(expect.objectContaining({
                message: 'Bookmark created successfully',
                bookmark: {
                    userId: eventBookmark.userId,
                    eventId: eventBookmark.eventId,
                    created_at: expect.any(String),
                }
            }));

            expect(mockDynamoDB.postItem).toHaveBeenCalledWith('shelterlinkEventBookmarks', expect.objectContaining({
                userId: { S: "1" },
                eventId: { S: "1" },
                created_at: { S: expect.any(String) }
            })
            );
            expect(mockDynamoDB.queryTable).toHaveBeenCalledWith(
                'shelterlinkEvents',
                `eventId = :bookmarkId`,
                { ':bookmarkId': { S: '1' } }
            );
        });


        it('should throw an error when posting a shelter bookmark if DynamoDB queryTable returns an empty list', async () => {
            mockDynamoDB.queryTable.mockResolvedValue([]);

            await expect(service.postBookmark('1', '1', 'shelter')).rejects.toThrow(new Error('shelter with ID 1 does not exist.'));
        });

        it('should throw an error when posting an event bookmark if DynamoDB queryTable returns an empty list', async () => {
            mockDynamoDB.queryTable.mockResolvedValue([]);

            await expect(service.postBookmark('1', '1', 'event')).rejects.toThrow(new Error('event with ID 1 does not exist.'));
        });

        it('should throw an error when posting a shelter bookmark if DynamoDB postItem fails', async () => {
            mockDynamoDB.postItem.mockRejectedValue(new Error('DynamoDB error'));
            mockDynamoDB.queryTable.mockResolvedValue([dynamoDBShelterBookmark]);

            await expect(service.postBookmark('1', '1', 'shelter')).rejects.toThrow(new Error('DynamoDB error'));
        });

        it('should throw an error when posting an event bookmark if DynamoDB postItem fails', async () => {
            mockDynamoDB.postItem.mockRejectedValue(new Error('DynamoDB error'));
            mockDynamoDB.queryTable.mockResolvedValue([dynamoDBEventBookmark]);

            await expect(service.postBookmark('1', '1', 'event')).rejects.toThrow(new Error('DynamoDB error'));
        });

        it('should throw an error when passing an invalid type', async () => {
            await expect(service.postBookmark('1', '1', 'invalidType')).rejects.toThrow(new Error('Invalid type. Must be either "shelter" or "event".'));
        });
    });

    describe('deleteBookmark', () => {
        it('should delete a shelter bookmark successfully', async () => {
            mockDynamoDB.deleteItem.mockResolvedValue(true);
            const response = await service.deleteBookmark('1', '1', 'shelter');
            expect(mockDynamoDB.deleteItem).toHaveBeenCalledWith(
                'shelterlinkShelterBookmarks',
                { userId: { S: '1' }, 'shelterId': { S: '1' } }
            );
            expect(response.message).toEqual('Bookmark deleted successfully');
        });

        it('should delete an event bookmark successfully', async () => {
            mockDynamoDB.deleteItem.mockResolvedValue(true);
            const response = await service.deleteBookmark('1', '1', 'event');
            expect(mockDynamoDB.deleteItem).toHaveBeenCalledWith(
                'shelterlinkEventBookmarks',
                { userId: { S: '1' }, 'eventId': { S: '1' } }
            );
            expect(response.message).toEqual('Bookmark deleted successfully');
        });

        it('should throw an error when trying to delete a shelter bookmark if DynamoDB deleteItem fails', async () => {
            mockDynamoDB.deleteItem.mockRejectedValue(new Error('DynamoDB error'));

            await expect(service.deleteBookmark('1', '1', 'shelter')).rejects.toThrow(new Error('Error deleting bookmark: Error: DynamoDB error'));
        });

        it('should throw an error when trying to delete an event bookmark if DynamoDB deleteItem fails', async () => {
            mockDynamoDB.deleteItem.mockRejectedValue(new Error('DynamoDB error'));

            await expect(service.deleteBookmark('1', '1', 'event')).rejects.toThrow(new Error('Error deleting bookmark: Error: DynamoDB error'));
        });
    });

    describe('getUserBookmarks', () => {
        it('should get a users shelter bookmarks successfully', async () => {
            mockDynamoDB.scanTable.mockResolvedValue([dynamoDBShelterBookmark.item]);
            const response = await service.getUserBookmarks('1', 'shelter');
            expect(response).toEqual([shelterBookmark]);
            expect(mockDynamoDB.scanTable).toHaveBeenCalledWith('shelterlinkShelterBookmarks', 'userId = :userId', { ':userId': { S: '1' } });
        });

        it('should get a users event bookmarks successfully', async () => {
            mockDynamoDB.scanTable.mockResolvedValue([dynamoDBEventBookmark.item]);
            const response = await service.getUserBookmarks('1', 'event');
            expect(response).toEqual([eventBookmark]);
            expect(mockDynamoDB.scanTable).toHaveBeenCalledWith('shelterlinkEventBookmarks', 'userId = :userId', { ':userId': { S: '1' } });
        });

        it('should throw an error when trying to get a users shelter bookmarks if DynamoDB scanTable fails', async () => {
            mockDynamoDB.scanTable.mockRejectedValue(new Error('DynamoDB error'));

            await expect(service.getUserBookmarks('1', 'shelter')).rejects.toThrow(new Error('Unable to get bookmarks: Error: DynamoDB error'));
        });

        it('should throw an error when trying to get a users event bookmarks if DynamoDB scanTable fails', async () => {
            mockDynamoDB.scanTable.mockRejectedValue(new NotFoundException('DynamoDB error'));

            await expect(service.getUserBookmarks('1', 'event')).rejects.toThrow(new NotFoundException('Unable to get bookmarks: NotFoundException: DynamoDB error'));
        });
    });
});