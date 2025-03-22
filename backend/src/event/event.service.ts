import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoDbService } from '../dynamodb';
import { EventInputModel, EventModel } from './event.model';

@Injectable()
export class EventService {
  private readonly tableName = 'shelterlinkEvents';
  constructor(private readonly dynamoDbService: DynamoDbService) {}

  public async getEvent(id: string) {
    throw new Error('Method not implemented.');
  }

  public async getEvents() {
    try {
      const data = await this.dynamoDbService.scanTable(this.tableName);
      return data.map((item) => this.eventModelToOutput(item));
    } catch (e) {
      throw new Error('Unable to get shelters: ' + e);
    }
  }

  /**
     * Converts a shelter model from DynamoDB to a ShelterModel.
     * @param input The input shelter model from DynamoDB.
     * @returns The ShelterModel.
     */
    private eventModelToOutput = (input: EventInputModel): EventModel => {
      const newShelterModel: EventModel = {};
  
      if (input.rating !== undefined) {
        newShelterModel.rating = parseFloat(input.rating.N);
      }
  
      if (input.website !== undefined) {
        newShelterModel.website = input.website.S;
      }
  
      if (input.expanded_name !== undefined) {
        newShelterModel.expanded_name = input.expanded_name.S;
      }
  
      return newShelterModel;
    };
}