import { Injectable } from '@nestjs/common';

import { DynamoDbService } from '../dynamodb';
import { NewUserInput } from '../dtos/newUserDTO';
import { UserInputModel } from './user.model';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  SignUpCommand,
  AdminConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class UserService {
  private readonly tableName = 'shelterlinkUsers';
  private cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });
  constructor(private readonly dynamoDbService: DynamoDbService) {}

  public async postUser(userData) {
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
}
