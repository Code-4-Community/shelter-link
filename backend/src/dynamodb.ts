import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  DeleteItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DynamoDbService {
  private readonly dynamoDbClient: DynamoDBClient;

  constructor() {
    this.dynamoDbClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  public async scanTable(
    tableName: string,
    filterExpression?: string,
    expressionAttributeValues?: { [key: string]: any },
    expressionAttributeNames?: { [key: string]: any }
  ): Promise<any[]> {
    // By default, scan the entire table
    const params: any = {
      TableName: tableName,
    };

    // Add FilterExpression and ExpressionAttributeValues if given
    if (filterExpression) {
      params.FilterExpression = filterExpression;
    }
    if (expressionAttributeValues) {
      params.ExpressionAttributeValues = expressionAttributeValues;
    }
    if (expressionAttributeNames) {
      params.ExpressionAttributeNames = expressionAttributeNames;
    }

    try {
      const data = await this.dynamoDbClient.send(new ScanCommand(params));
      return data.Items || [];
    } catch (error) {
      console.error('DynamoDB Scan Error:', error);
      throw new Error(`Unable to scan table ${tableName}`);
    }
  }

  public async getHighestShelterId(
    tableName: string
  ): Promise<number | undefined> {
    const params: any = {
      TableName: tableName,
      ProjectionExpression: 'shelterId', // Project only the id attribute
    };

    try {
      const data = await this.dynamoDbClient.send(new ScanCommand(params));
      const shelterIds = data.Items.map((item) =>
        parseInt(item.shelterId.S, 10)
      ); // Convert to numbers

      // Handle potential parsing errors
      const validShelterIds = shelterIds.filter((id) => !isNaN(id));

      if (validShelterIds.length === 0) {
        return undefined; // No valid user IDs found
      }

      const highestShelterId = validShelterIds.reduce((max, current) =>
        Math.max(max, current)
      );
      return highestShelterId;
    } catch (error) {
      console.error('DynamoDB Scan Error:', error);
      throw new Error(`Unable to scan table ${tableName}`);
    }
  }

  public async postItem(tableName: string, item) {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: item,
    });

    try {
      const result = await this.dynamoDbClient.send(command);
      return result;
    } catch (error) {
      console.log(`Error posting item to table ${tableName}`);
      throw new Error(error);
    }
  }

  public async getItem(
    tableName: string,
    key: { [key: string]: any }
  ): Promise<any | null> {
    const params = {
      TableName: tableName,
      Key: key,
    };

    try {
      const result = await this.dynamoDbClient.send(new GetItemCommand(params));
      return result.Item ?? null; // Return the item if found, otherwise null
    } catch (error) {
      console.error('DynamoDB GetItem Error:', error);
      throw new Error(`Unable to get item from ${tableName}: ${error.message}`);
    }
  }

  public async deleteItem(
    tableName: string,
    key: { [key: string]: any }
  ): Promise<boolean> {
    try {
      // First, check if the item exists
      const existingItem = await this.getItem(tableName, key);

      if (!existingItem) {
        throw new NotFoundException(
          `Shelter with ID ${key.shelterId.S} not found.`
        ); // Item does not exist
      }

      // Delete the existing item
      await this.dynamoDbClient.send(
        new DeleteItemCommand({ TableName: tableName, Key: key })
      );
      return true;
    } catch (error) {
      console.error('DynamoDB Delete Error:', error);
      throw new Error(
        `Unable to delete item from ${tableName}: ${error.message}`
      );
    }
  }
}
