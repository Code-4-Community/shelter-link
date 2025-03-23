import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  DeleteItemCommand,
  UpdateItemCommand,
  GetItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { Injectable, NotFoundException } from '@nestjs/common';
import { HoursUpdateModel } from './shelter/shelter.model';
import { DayOfWeek } from './types';

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

  public async getHighestId(
    tableName: string,
    id: string
  ): Promise<number | undefined> {
    const params: any = {
      TableName: tableName,
      ProjectionExpression: id, // Project only the id attribute
    };

    try {
      const data = await this.dynamoDbClient.send(new ScanCommand(params));
      const ids = data.Items.map(
        (item) => parseInt(item[id]?.S, 10) // Dynamically access the id attribute
      );

      // Handle potential parsing errors
      const validIds = ids.filter((id) => !isNaN(id));

      if (validIds.length === 0) {
        return undefined; // No valid user IDs found
      }

      const highestId = validIds.reduce((max, current) =>
        Math.max(max, current)
      );
      return highestId;
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
      console.error(`Error posting item to table ${tableName}`);
      throw new Error(error);
    }
  }

  /**
   * Handles a singular entry in update expression given the current index is on a list
   * @param i the current index
   * @param attributeNames exact same value as passed in updateAttributes
   * @param attributeValues exact same value as passed in updateAttributes
   */
  private updateAttributesHandleList(
    i: number,
    currVal: string,
    ExpressionAttributeValues,
    names: string[]
  ) {
    let nestedList = currVal
      .substring(2, currVal.toString().length - 3)
      .split('","');

    // Value as a list, I tried building onto an object dynamically so these
    // lengths don't need to be checked like this but that didn't seem to work.
    if (nestedList.length === 1) {
      ExpressionAttributeValues[`:${names[names.length - 1]}`] = {
        L: [{ S: nestedList[0] }],
      };
    } else if (nestedList.length === 2) {
      ExpressionAttributeValues[`:${names[names.length - 1]}`] = {
        L: [{ S: nestedList[0] }, { S: nestedList[1] }],
      };
    } else if (nestedList.length === 3) {
      ExpressionAttributeValues[`:${names[names.length - 1]}`] = {
        L: [{ S: nestedList[0] }, { S: nestedList[1] }, { S: nestedList[2] }],
      };
    }
  }

  /**
   * Validate input for the updateAttributes method
   * @param Key
   * @param tableName
   * @param shelterId
   * @param attributeNames
   * @param attributeValues
   */
  private async validateInputForUpdate(
    Key,
    tableName: string,
    shelterId: string,
    attributeNames: string[],
    attributeValues: (string | number)[]
  ) {
    if (attributeNames.length !== attributeValues.length) {
      const err = `Error updating attributes of shelter ${shelterId} to table ${tableName}: 
          attributeNames and attributeValues must be the same length`;
      throw new Error(err);
    }

    const existingItem = await this.getItem(tableName, Key);

    if (!existingItem) {
      throw new NotFoundException(`Shelter with ID ${shelterId} not found.`);
    }

    return existingItem;
  }

  /**
   * Handles one iteration for non-number cases given that the value is a string
   * @param i the index to check the names or values list
   * @param closeOrOpenTimeCount keeps track of how many times opening_time or closing_time were seen so far
   * @param UpdateExpression update expression param for db call
   * @param ExpressionAttributeNames expression attribute names for db call
   * @param ExpressionAttributeValues expression attribute values for db call
   * @param attributeNames the attribute names passed from the application's service
   * @param attributeValues the attribute values passed from the application's service
   * @returns The new values for modified params that are not pass by reference
   */
  private handleNonNumberCasesForUpdateAttributes(
    i: number,
    UpdateExpression: string,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    attributeNames: string[],
    attributeValues: (string | number)[]
  ): string {
    let currVal = attributeValues[i] as string;

    // each variable in a map: e.g. item1.item2 have to have
    // separate aliases, which is why it is split up and defined here
    let names = attributeNames[i].split('.');
    for (let name of names) {
      UpdateExpression += `#${name}.`;
      ExpressionAttributeNames[`#${name}`] = name;
    }

    //Remove the last . in the update expression: e.g. item1.item2. -> item1.item2
    UpdateExpression = UpdateExpression.substring(
      0,
      UpdateExpression.length - 1
    );

    UpdateExpression += ` = :${names[names.length - 1]}, `;

    //Checking to see if a list was passed in as a value
    if (
      currVal.toString().includes('["') &&
      currVal.toString().includes('"]')
    ) {
      this.updateAttributesHandleList(
        i,
        currVal,
        ExpressionAttributeValues,
        names
      );
    } else {
      //Non-list case, still includes nested values
      ExpressionAttributeValues[`:${names[names.length - 1]}`] = {
        S: attributeValues[i],
      };
    }

    return UpdateExpression;
  }

  /**
   * Merges the existing shelters' hours with the desired updates
   * @param existingShelter the existing shelter in the database
   * @param hoursUpdate an hours map with only newer values to update to
   */
  private mergeHours(existingShelter: any, hoursUpdate: HoursUpdateModel): any {
    let result = {
      Sunday: {},
      Monday: {},
      Tuesday: {},
      Wednesday: {},
      Thursday: {},
      Friday: {},
      Saturday: {},
    };
    for (const key in existingShelter.hours.M) {
      result[key] = existingShelter.hours.M[key].M;
    }
    for (const day in DayOfWeek) {
      // the values of the enum are in all-caps, but the db is in proper caps so it must be translated
      const properCapitalDay =
        day.charAt(0).toUpperCase() + day.substring(1).toLowerCase();

      if (typeof hoursUpdate[properCapitalDay] !== 'undefined') {
        if (
          typeof hoursUpdate[properCapitalDay]['closing_time'] !== 'undefined'
        ) {
          result[properCapitalDay]['closing_time'] = {
            S: hoursUpdate[properCapitalDay]['closing_time'],
          };
        }
        if (
          typeof hoursUpdate[properCapitalDay]['opening_time'] !== 'undefined'
        ) {
          result[properCapitalDay]['opening_time'] = {
            S: hoursUpdate[properCapitalDay]['opening_time'],
          };
        }
      }
    }
    for (const day in result) {
      if (Object.keys(result[day]).length === 0) {
        // Check if the object is empty
        delete result[day];
      }
    }

    return result;
  }

  /**
   * Updates the attribute of the specified name to the specified value
   * within the table
   * @param tableName Name of the table
   * @param shelterId id of the shelter (key of the shelter)
   * @param hourUpdates A list of day maps: e.g. { "Friday": {"opening_time": "05:00", "closing_time": "10:00"}} is one item
   * @param attributeName The name of the attribute:
   *                      Must be given with its parent separated by periods,
   *                      e.g. "address.zipCode"
   *                      For lists, must have format "[\"item1\", \"item2\", ... ]"
   * @param attributeValue The desired new value of the attribute
   */
  public async updateAttributes(
    tableName: string,
    shelterId: string,
    attributeNames: string[],
    attributeValues: (string | number)[],
    hoursMap: boolean | HoursUpdateModel
  ) {
    const Key = { shelterId: { S: shelterId + '' } };
    const existingShelter = await this.validateInputForUpdate(
      Key,
      tableName,
      shelterId,
      attributeNames,
      attributeValues
    );

    // Helped by https://stackoverflow.com/questions/55825544/how-to-dynamically-update-an-attribute-in-a-dynamodb-item
    // Looping through the input and adding to the update expression so everything is updated in one call
    let UpdateExpression = 'SET ';
    let ExpressionAttributeNames = {};
    let ExpressionAttributeValues = {};

    if (typeof hoursMap === 'object') {
      let mergedObject = this.mergeHours(existingShelter, hoursMap);
      for (let dayKey in mergedObject) {
        UpdateExpression += `#hours.#${dayKey} = :${dayKey}, `;
        ExpressionAttributeNames[`#${dayKey}`] = dayKey;
        ExpressionAttributeValues[`:${dayKey}`] = { M: mergedObject[dayKey] };
      }

      ExpressionAttributeNames['#hours'] = 'hours';
    }

    for (let i = 0; i < attributeNames.length; i++) {
      //non-number cases
      if (typeof attributeValues[i] === 'string') {
        let res = this.handleNonNumberCasesForUpdateAttributes(
          i,
          UpdateExpression,
          ExpressionAttributeNames,
          ExpressionAttributeValues,
          attributeNames,
          attributeValues
        );
        UpdateExpression = res;
      } else {
        //number cases; data inputted still needs quotation marks
        UpdateExpression += `#${attributeNames[i]} = :${attributeNames[i]}, `;
        ExpressionAttributeNames[`#${attributeNames[i]}`] = attributeNames[i];
        ExpressionAttributeValues[`:${attributeNames[i]}`] = {
          N: `${attributeValues[i]}`,
        };
      }
    }

    //Removing the trailing comma -> e.g. "..., item1.item2 = :item2, " -> "..., item1.item2 = :item2"
    UpdateExpression = UpdateExpression.substring(
      0,
      UpdateExpression.length - 2
    );

    const command = new UpdateItemCommand({
      TableName: tableName,
      ReturnValues: 'UPDATED_NEW',
      Key,
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    });
    try {
      const result = await this.dynamoDbClient.send(command);
      return result;
    } catch (error) {
      console.error(
        `Error updating ${attributeNames} to ${attributeValues} for shelter ${shelterId} to table ${tableName}`
      );
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

  /**
   * Checks if an email already exists in the specified table. This method is used to ensure
   * that emails are unique across the application.
   *
   * @param tableName - The name of the table to check for the email.
   * @param email - The email to check for uniqueness.
   * @returns True if the email exists, false otherwise.
   */
  public async checkIfEmailExists(
    tableName: string,
    email: string
  ): Promise<boolean> {
    const params = {
      TableName: tableName,
      IndexName: 'email-index', // We have a secondary index on the email attribute
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email },
      },
    };

    try {
      const data = await this.dynamoDbClient.send(new QueryCommand(params));
      return data.Items && data.Items.length > 0; // Return true if email exists
    } catch (error) {
      console.error('Error checking email uniqueness:', error);
      throw new Error('Unable to check email uniqueness.');
    }
  }

  /**
   * Queries a table in DynamoDB using the specified key condition expression and expression attribute values.
   *
   * @param tableName - The name of the table to query.
   * @param keyConditionExpression - The key condition expression for the query.
   * @param expressionAttributeValues - The expression attribute values for the query.
   * @param indexName - The name of the index to use for the query.
   * @returns The items returned by the query.
   */
  public async queryTable(
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: { [key: string]: any },
    indexName?: string
  ): Promise<any[]> {
    const params = {
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    if (indexName) {
      params['IndexName'] = indexName;
    }

    try {
      const data = await this.dynamoDbClient.send(new QueryCommand(params));
      return data.Items || [];
    } catch (error) {
      console.error('DynamoDB Query Error:', error);
      throw new Error(`Unable to query table ${tableName}`);
    }
  }
}
