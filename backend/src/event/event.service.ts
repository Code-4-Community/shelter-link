import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoDbService } from '../dynamodb';
import { EventInputModel, EventModel } from './event.model';

@Injectable()
export class EventService {
  private readonly tableName = 'shelterlinkEvents';
  constructor(private readonly dynamoDbService: DynamoDbService) {}

  /**
   * Retrieve a specific event from the database.
   * @returns a specific event
   * @throws Error if the event cannot be retrieved
   */
  public async getEvent(id: string) {
    try {
      const data = await this.dynamoDbService.scanTable(
        this.tableName,
        'id = :id',
        { ':id': { S: id } }
      );
      return this.eventModelToOutput(data[0]);
    } catch (e) {
      throw new Error('Unable to get event: ' + e);
    }
  }

  /**
   * Retrieve all events from the database.
   * @returns The list of events.
   * @throws Error if the events cannot be retrieved.
   */
  public async getEvents() {
    try {
      const data = await this.dynamoDbService.scanTable(this.tableName);
      return data.map((item) => this.eventModelToOutput(item));
    } catch (e) {
      throw new Error('Unable to get events: ' + e);
    }
  }

  /**
   * Converts an event model from DynamoDB to a EventModel.
   * @param input The input event model from DynamoDB.
   * @returns The EventModel.
   */
  private eventModelToOutput = (input: EventInputModel): EventModel => {
    const newEventModel: EventModel = {
      eventId: input.eventId.S,
      event_name: input.event_name.S,
      description: input.description.S,
      date: input.date.S,
      host_name: input.host_name.S ? input.host_name.S : undefined,
      location: {
        street: input.location ? input.location.M.street.S : undefined,
        city: input.location ? input.location.M.city.S : undefined,
        state: input.location ? input.location.M.state.S : undefined,
        zipCode: input.location ? input.location.M.zipCode.S : undefined,
        country:
          input.location && input.location.M.country
            ? input.location.M.country.S
            : undefined,
      },
      website: input.website.S ? input.website.S : undefined,
      registration_link: input.registration_link.S
        ? input.registration_link.S
        : undefined,
      phone_number: input.phone_number.S ? input.phone_number.S : undefined,
      picture: input.picture
        ? input.picture.L.map((url: { S: string }) => url.S)
        : undefined,
    };

    return newEventModel;
  };
}
