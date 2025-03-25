import { Injectable } from '@nestjs/common';
import { DynamoDbService } from '../dynamodb';
import { NewEventInput } from '../dtos/newEventDTO';
import { EventInputModel, EventModel } from './event.model';

@Injectable()
export class EventService {
  private readonly tableName = 'shelterlinkEvents';
  constructor(private readonly dynamoDbService: DynamoDbService) {}

  /**
   * Add a new event to the database.
   * @param eventData The data for the new event.
   * @returns The new event's ID.
   * @throws Error if the event cannot be added.
   */
  public async postEvent(eventData: NewEventInput) {
    // Validate date is a valid datetime
    const date = new Date(eventData.date);

    // Check if the date is invalid (Invalid dates return `NaN`)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format. Please provide a valid date.');
    }

    try {
      const eventModel = this.postInputToEventModel(eventData);
      const newId =
        ((await this.dynamoDbService.getHighestShelterId(this.tableName)) ??
          0) + 1;
      eventModel.eventId.S = newId.toString();

      const result = await this.dynamoDbService.postItem(
        this.tableName,
        eventModel
      );
      return { ...result, id: newId };
    } catch (e) {
      throw new Error('Unable to create event: ' + e);
    }
  }

  /**
   * Retrieve all events from the database.
   * @returns All events in the database.
   */
  public async getEvents(): Promise<EventModel[]> {
    try {
      const data = await this.dynamoDbService.scanTable(this.tableName);
      return data.map((item) => this.eventModelToOutput(item));
    } catch (e) {
      throw new Error('Unable to get events: ' + e);
    }
  }

  /**
   * Retrieve the event with the given id from the database.
   * @returns The specified event, or an error if it does not exist.
   */
  public async getEvent(eventId: string): Promise<EventModel> {
    try {
      const data = await this.dynamoDbService.scanTable(
        this.tableName,
        'eventId = :eventId',
        { ':eventId': { S: eventId } }
      );
      return this.eventModelToOutput(data[0]);
    } catch (e) {
      throw new Error(`Event with id ${eventId} does not exist: ${e.message}`);
    }
  }

  /**
   * Converts the input data to a event model suitable for DynamoDB.
   * @param input The input data for the new event.
   * @returns The event model.
   */
  private postInputToEventModel = (input: NewEventInput): EventInputModel => {
    const newEventModel: EventInputModel = {
      eventId: { S: '' },
      event_name: { S: input.event_name },
      description: { S: input.description },
      date: { S: input.date },
    };

    if (input.host_name) {
      newEventModel.host_name = { S: input.host_name };
    }

    if (input.location) {
      newEventModel.location = {
        M: {
          street: { S: input.location.street },
          city: { S: input.location.city },
          state: { S: input.location.state },
          zipCode: { S: input.location.zipCode },
        },
      };

      if (input.location.country) {
        newEventModel.location.M.country = { S: input.location.country };
      }
    }

    if (input.website) {
      newEventModel.website = { S: input.website };
    }

    if (input.registration_link) {
      newEventModel.registration_link = { S: input.registration_link };
    }

    if (input.phone_number) {
      newEventModel.phone_number = { S: input.phone_number };
    }

    if (input.picture) {
      newEventModel.picture = { L: input.picture.map((url) => ({ S: url })) };
    }

    return newEventModel;
  };

  /**
   * Converts an event model from DynamoDB to an event model.
   * @param item The event model from DynamoDB.
   * @returns The event model for output.
   */
  private eventModelToOutput = (input: EventInputModel) => {
    const eventModel: EventModel = {
      eventId: input.eventId.S,
      event_name: input.event_name.S,
      description: input.description.S,
      date: input.date.S,
    };

    if (input.host_name) {
      eventModel.host_name = input.host_name.S;
    }

    if (input.location) {
      eventModel.location = {
        street: input.location.M.street.S,
        city: input.location.M.city.S,
        state: input.location.M.state.S,
        zipCode: input.location.M.zipCode.S,
      };

      if (input.location.M.country) {
        eventModel.location.country = input.location.M.country.S;
      }
    }

    if (input.website) {
      eventModel.website = input.website.S;
    }

    if (input.registration_link) {
      eventModel.registration_link = input.registration_link.S;
    }

    if (input.phone_number) {
      eventModel.phone_number = input.phone_number.S;
    }

    if (input.picture) {
      eventModel.picture = input.picture.L.map((url) => url.S);
    }

    return eventModel;
  };
}
