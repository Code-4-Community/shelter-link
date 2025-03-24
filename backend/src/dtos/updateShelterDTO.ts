import { DayOfWeek } from '../types';

export type UpdateShelterInput = {
  name?: string;
  expanded_name?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  latitude?: number;
  longitude?: number;
  description?: string;
  rating?: number;
  phone_number?: string;
  email_address?: string;
  website?: string;
  hours?: {
    [day in DayOfWeek]: {
      opening_time?: string;
      closing_time?: string;
    };
  };
  picture?: string[];
};
