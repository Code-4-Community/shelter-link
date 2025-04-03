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
  tags?: {
    wheelchair_accessible?: boolean;
    pet_friendly?: boolean;
    family_friendly?: boolean;
    legal_aid?: boolean;
    lgbtq_focused?: boolean;
    mental_health_resources?: boolean;
    overnight_stay?: boolean;
    food_resources?: boolean;
    clothing_resources?: boolean;
    transportation_resources?: boolean;
    hygiene_facilities?: boolean;
    job_assistance?: boolean;
    medical_resources?: boolean;
    educational_programs?: boolean;
    substance_abuse_support?: boolean;
  };
};
