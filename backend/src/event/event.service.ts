import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoDbService } from '../dynamodb';

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
    private eventModelToOutput = (input: ShelterInputModel): ShelterModel => {
      const newShelterModel: ShelterModel = {
        shelterId: input.shelterId.S,
        name: input.name.S,
        address: {
          street: input.address.M.street.S,
          city: input.address.M.city.S,
          state: input.address.M.state.S,
          zipCode: input.address.M.zipCode.S,
          country: input.address.M.country.S,
        },
        latitude: parseFloat(input.latitude.N),
        longitude: parseFloat(input.longitude.N),
        description: input.description.S,
        phone_number: input.phone_number.S,
        email_address: input.email_address.S,
        hours: {
          Monday: input.hours.M.Monday
            ? {
                opening_time: input.hours.M.Monday.M.opening_time.S,
                closing_time: input.hours.M.Monday.M.closing_time.S,
              }
            : null,
          Tuesday: input.hours.M.Tuesday
            ? {
                opening_time: input.hours.M.Tuesday.M.opening_time.S,
                closing_time: input.hours.M.Tuesday.M.closing_time.S,
              }
            : null,
          Wednesday: input.hours.M.Wednesday
            ? {
                opening_time: input.hours.M.Wednesday.M.opening_time.S,
                closing_time: input.hours.M.Wednesday.M.closing_time.S,
              }
            : null,
          Thursday: input.hours.M.Thursday
            ? {
                opening_time: input.hours.M.Thursday.M.opening_time.S,
                closing_time: input.hours.M.Thursday.M.closing_time.S,
              }
            : null,
          Friday: input.hours.M.Friday
            ? {
                opening_time: input.hours.M.Friday.M.opening_time.S,
                closing_time: input.hours.M.Friday.M.closing_time.S,
              }
            : null,
          Saturday: input.hours.M.Saturday
            ? {
                opening_time: input.hours.M.Saturday.M.opening_time.S,
                closing_time: input.hours.M.Saturday.M.closing_time.S,
              }
            : null,
          Sunday: input.hours.M.Sunday
            ? {
                opening_time: input.hours.M.Sunday.M.opening_time.S,
                closing_time: input.hours.M.Sunday.M.closing_time.S,
              }
            : null,
        },
        picture: input.picture.L.map((url: { S: string }) => url.S),
      };
  
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
