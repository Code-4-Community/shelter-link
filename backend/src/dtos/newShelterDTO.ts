import { DayOfWeek } from '../types';

export type NewShelterInput = {
  // shelterId: string; // auto generated
  name: string;
  expanded_name?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  latitude: number;
  longitude: number;
  description: string;
  rating?: number;
  availability: string;
  phone_number: string;
  email_address: string;
  website?: string;
  hours: {
    [day in DayOfWeek]: {
      opening_time: string;
      closing_time: string;
    } | null;
  };
  picture: string[];
};
