import { Injectable } from '@nestjs/common';

import { DynamoDbService } from '../dynamodb';
import { NewUserInput } from '../dtos/newUserDTO';
import { UserInputModel, UserModel } from './user.model';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { LoginUserRequest } from '../types';

@Injectable()
export class UserService {
  private readonly tableName = 'shelterlinkUsers';
  private cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });

  constructor(private readonly dynamoDbService: DynamoDbService) {}

  /**
   * Creates a new user in the database.
   * @param userData The data of the new user, including email, first and last name, and password
   */
  public async postUser(userData: NewUserInput): Promise<void> {
    // Make sure email is unique
    const existingUser = await this.dynamoDbService.checkIfEmailExists(
      this.tableName,
      userData.email
    );
    if (existingUser) {
      throw new Error(
        `A user with the email ${userData.email} already exists.`
      );
    }

    const userModel = this.postInputToUserModel(userData);
    const newId =
      ((await this.dynamoDbService.getHighestId(this.tableName, 'userId')) ??
        0) + 1;
    userModel.userId.S = newId.toString();

    // Create Cognito User
    await this.createCognitoUser(
      userData.email,
      userData.password,
      userData.first_name,
      userData.last_name
    );

    // Save to DynamoDB
    await this.dynamoDbService.postItem(this.tableName, userModel);
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
    };

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
      throw new Error(error + 'Invalid email or password');
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

    const user = queryResult[0] as UserModel;
    return user;
  }
}
