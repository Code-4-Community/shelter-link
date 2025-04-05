import { Injectable } from '@nestjs/common';

import { DynamoDbService } from '../dynamodb';
import { NewUserInput } from '../dtos/newUserDTO';
import { UserInputModel, UserModel } from './user.model';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  InitiateAuthCommand,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { LoginUserRequest, UserRole } from '../types';
import {
  UserEventBookmarkInputModel,
  UserEventBookmarkModel,
  UserShelterBookmarkInputModel,
  UserShelterBookmarkModel,
} from './userBookmarks.model';

@Injectable()
export class UserService {
  private readonly tableName = 'shelterlinkUsers';
  private readonly shelterBookmarkTableName = 'shelterlinkShelterBookmarks';
  private readonly eventBookmarkTableName = 'shelterlinkEventBookmarks';
  private cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });

  constructor(private readonly dynamoDbService: DynamoDbService) {}

  /**
   * Creates a new user in the database.
   * @param userData The data of the new user, including email, first and last name, and password
   *
   * @returns The created user model.
   */
  public async postUser(userData: NewUserInput): Promise<UserModel> {
    try {
      // Create Cognito user. If a user is already signed up with he given email, an error will be thrown
      await this.createCognitoUser(
        userData.email,
        userData.password,
        userData.first_name,
        userData.last_name
      );
    } catch (error) {
      if (error instanceof UsernameExistsException) {
        console.log('User already exists with this email:', error);
        throw new Error(
          'User already exists with this email. Please use a different email.'
        );
      } else {
        throw new Error('Error creating Cognito user: ' + error);
      }
    }
    const userModel = this.postInputToUserModel(userData);
    const newId =
      ((await this.dynamoDbService.getHighestId(this.tableName, 'userId')) ??
        0) + 1;
    userModel.userId.S = newId.toString();

    // Save to DynamoDB
    await this.dynamoDbService.postItem(this.tableName, userModel);

    const userOutput = this.userModelToOutput(userModel);

    return userOutput;
  }

  /**
   * Retrieves all users from the database.
   * @returns An array of user models.
   */
  public async getUsers(): Promise<UserModel[]> {
    try {
      const data = await this.dynamoDbService.scanTable(this.tableName);
      return data.map((item) => this.userModelToOutput(item));
    } catch (e) {
      throw new Error('Unable to get users: ' + e);
    }
  }

  /**
   * Converts a DynamoDB user model to a user model.
   * @param item The DynamoDB user model.
   * @returns The user model.
   */
  private userModelToOutput = (item: UserInputModel): UserModel => {
    return {
      userId: item.userId.S,
      first_name: item.first_name.S,
      last_name: item.last_name.S,
      email: item.email.S,
      created_at: item.created_at.S,
      role: item.role ? item.role.S : UserRole.USER, // Default to USER if not provided
    };
  };

  /**
   * Converts the input data to a user model suitable for DynamoDB.
   * @param input The input data for the new user.
   * @returns The user model.
   */
  private postInputToUserModel = (input: NewUserInput): UserInputModel => {
    const newUserModel: UserInputModel = {
      userId: { S: '0' },
      first_name: { S: input.first_name },
      last_name: { S: input.last_name },
      email: { S: input.email },
      created_at: { S: new Date().toISOString() },
      role: { S: input.role ? input.role : UserRole.USER }, // Default to USER role
    };

    if (input.role) {
      newUserModel.role = { S: input.role };
    } else {
      newUserModel.role = { S: UserRole.USER }; // Default role
    }
    return newUserModel;
  };

  /**
   * Creates a new user in Cognito.
   * @param email The email of the new user.
   * @param password The password of the new user.
   * @param givenName The first name of the new user.
   * @param familyName The last name of the new user.
   * @returns The email of the new user.
   */
  private createCognitoUser = async (
    email: string,
    password: string,
    givenName: string,
    familyName: string
  ): Promise<{ email: string }> => {
    const signUpParams = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'given_name',
          Value: givenName,
        },
        {
          Name: 'family_name',
          Value: familyName,
        },
      ],
    };
    const signUpCommand = new SignUpCommand(signUpParams);
    await this.cognitoClient.send(signUpCommand);

    const confirmParams = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: email,
    };
    const confirmCommand = new AdminConfirmSignUpCommand(confirmParams);
    await this.cognitoClient.send(confirmCommand);
    return {
      email,
    };
  };

  /**
   * Logs in an existing user. Throws an error if the user is not found or the password is incorrect.
   *
   * @param loginData The data of the user to log in, including email and password.
   */
  public async loginUser(loginData: LoginUserRequest): Promise<UserModel> {
    try {
      const input = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthFlow: 'USER_PASSWORD_AUTH' as const,
        AuthParameters: {
          USERNAME: loginData.body.email,
          PASSWORD: loginData.body.password,
        },
      };

      const command = new InitiateAuthCommand(input);
      await this.cognitoClient.send(command);
    } catch (error) {
      throw new Error(error);
    }

    const queryResult = await this.dynamoDbService.queryTable(
      this.tableName,
      'email = :email',
      { ':email': { S: loginData.body.email } },
      'email-index'
    );

    if (queryResult.length === 0) {
      throw new Error('User not found');
    }

    let user = queryResult[0];
    user = this.userModelToOutput(user);
    return user;
  }

  /**
   * Posts a user's bookmark (either a shelter or event) to the database.
   * @param userId The ID of the user.
   * @param bookmarkId The ID of the event or shelter to bookmark.
   * @param type The type of bookmark ('shelter' or 'event').
   * @returns The created bookmark model.
   * @throws Error if the type is not 'shelter' or 'event'.
   * @throws Error if there is an error saving or deleting the bookmark to the database.
   */
  public async postBookmark(userId: string, bookmarkId: string, type: string) {
    if (type !== 'shelter' && type !== 'event') {
      throw new Error('Invalid type. Must be either "shelter" or "event".');
    }

    const bookmarkModel = this.postInputToBookmarkModel(
      userId,
      bookmarkId,
      type
    );

    // check if the event or shelter exists
    const queryResult = await this.dynamoDbService.queryTable(
      type === 'shelter' ? 'shelterlinkShelters' : 'shelterlinkEvents',
      `${type}Id = :bookmarkId`,
      { ':bookmarkId': { S: bookmarkId } }
    );
    if (queryResult.length === 0) {
      throw new Error(`${type} with ID ${bookmarkId} does not exist.`);
    }

    // Save to DynamoDB
    if (type === 'shelter') {
      await this.dynamoDbService.postItem(
        this.shelterBookmarkTableName,
        bookmarkModel
      );
    } else {
      await this.dynamoDbService.postItem(
        this.eventBookmarkTableName,
        bookmarkModel
      );
    }

    return {
      message: 'Bookmark created successfully',
      bookmark: this.bookmarkModelToOutput(bookmarkModel),
    };
  }

  /**
   * Deletes a user's bookmark (either a shelter or event) from the database.
   * @param userId The ID of the user.
   * @param bookmarkId The ID of the event or shelter to delete.
   * @param type The type of bookmark ('shelter' or 'event').
   * @returns A success message.
   */
  public async deleteBookmark(
    userId: string,
    bookmarkId: string,
    type: string
  ): Promise<{ message: string }> {
    try {
      await this.dynamoDbService.deleteItem(
        type === 'shelter'
          ? this.shelterBookmarkTableName
          : this.eventBookmarkTableName,
        { userId: { S: userId }, [type + 'Id']: { S: bookmarkId } }
      );
      return {
        message: 'Bookmark deleted successfully',
      };
    } catch (error) {
      throw new Error('Error deleting bookmark: ' + error);
    }
  }

  /**
   * Retrieves a user's bookmarks from the database.
   * @param userId The ID of the user.
   * @param type The type of bookmark ('shelter' or 'event').
   * @returns An array of bookmark models.
   */
  public async getUserBookmarks(
    userId: string,
    type: 'shelter' | 'event'
  ): Promise<(UserShelterBookmarkModel | UserEventBookmarkModel)[]> {
    if (type !== 'shelter' && type !== 'event') {
      throw new Error('Invalid type. Must be either "shelter" or "event".');
    }

    try {
      const tablename =
        type === 'shelter'
          ? this.shelterBookmarkTableName
          : this.eventBookmarkTableName;
      const data = await this.dynamoDbService.scanTable(
        tablename,
        'userId = :userId',
        { ':userId': { S: userId } }
      );
      return data.map((item) => this.bookmarkModelToOutput(item));
    } catch (e) {
      throw new Error('Unable to get bookmarks: ' + e);
    }
  }

  /**
   * Converts the input data to a bookmark model suitable for DynamoDB.
   * @param userId The ID of the user.
   * @param bookmarkId The ID of the event or shelter to bookmark.
   * @returns The bookmark model.
   */
  private postInputToBookmarkModel = (
    userId: string,
    bookmarkId: string,
    type: 'shelter' | 'event'
  ): UserShelterBookmarkInputModel | UserEventBookmarkInputModel => {
    if (type === 'shelter') {
      return {
        userId: { S: userId },
        shelterId: { S: bookmarkId },
        created_at: { S: new Date().toISOString() },
      };
    } else {
      return {
        userId: { S: userId },
        eventId: { S: bookmarkId },
        created_at: { S: new Date().toISOString() },
      };
    }
  };

  /**
   * Converts a DynamoDB bookmark model to a bookmark model.
   * @param item The DynamoDB bookmark model.
   * @returns The bookmark model.
   */
  private bookmarkModelToOutput = (
    item: UserShelterBookmarkInputModel | UserEventBookmarkInputModel
  ): UserShelterBookmarkModel | UserEventBookmarkModel => {
    if ('shelterId' in item) {
      return {
        userId: item.userId.S,
        shelterId: item.shelterId.S,
        created_at: item.created_at.S,
      };
    } else {
      return {
        userId: item.userId.S,
        eventId: item.eventId.S,
        created_at: item.created_at.S,
      };
    }
  };
}
