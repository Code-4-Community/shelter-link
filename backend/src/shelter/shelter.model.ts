import { DayOfWeek } from '../types';

/**
 * Represents the model schema of a shelter.
 *
 * @property shelterId The unique identifier of the shelter.
 * @property name The name of the shelter.
 * @property expanded_name The expanded name of the shelter.
 * @property address The address of the shelter.
 * @property latitude The latitude of the shelter.
 * @property longitude The longitude of the shelter.
 * @property description The description of the shelter.
 * @property rating The rating of the shelter, a decimal number between (0, 5].
 * @property phone_number The phone number of the shelter.
 * @property email_address The email address of the shelter.
 * @property website The website of the shelter.
 * @property hours The hours of operation of the shelter. The key is the day of the week,
 * which maps to the opening and closing times. If the shelter is closed on a particular
 * day, the value is null.
 * @property picture Picture(s) of the shelter.
 * @property tags The tags associated with the shelter. Defaults to false for all tags.
 *
 */
export type ShelterModel = {
  shelterId: string;
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
  phone_number: string;
  email_address: string;
  website?: string;
  hours: {
    [day in DayOfWeek]: {
      opening_time: string; // Format: HH:MM.
      closing_time: string; // Format: HH:MM.
    } | null;
  };
  picture: string[]; // Array of S3 URLs
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

export type ShelterInputModel = {
  shelterId: { S: string };
  name: { S: string };
  expanded_name?: { S: string };
  address: {
    M: {
      street: { S: string };
      city: { S: string };
      state: { S: string };
      zipCode: { S: string };
      country?: { S: string };
    };
  };
  latitude: { N: string };
  longitude: { N: string };
  description: { S: string };
  rating?: { N: string };
  phone_number: { S: string };
  email_address: { S: string };
  website?: { S: string };
  hours: {
    M: {
      [day in DayOfWeek]: {
        M: {
          opening_time: { S: string };
          closing_time: { S: string };
        } | null;
      };
    };
  };
  picture: { L: { S: string }[] };
  tags?: {
    M: {
      wheelchair_accessible?: { BOOL: boolean };
      pet_friendly?: { BOOL: boolean };
      family_friendly?: { BOOL: boolean };
      legal_aid?: { BOOL: boolean };
      lgbtq_focused?: { BOOL: boolean };
      mental_health_resources?: { BOOL: boolean };
      overnight_stay?: { BOOL: boolean };
      food_resources?: { BOOL: boolean };
      clothing_resources?: { BOOL: boolean };
      transportation_resources?: { BOOL: boolean };
      hygiene_facilities?: { BOOL: boolean };
      job_assistance?: { BOOL: boolean };
      medical_resources?: { BOOL: boolean };
      educational_programs?: { BOOL: boolean };
      substance_abuse_support?: { BOOL: boolean };
    };
  };
};

export type ShelterUpdateModel = {
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

export type HoursUpdateModel = {
  [day in DayOfWeek]?: {
    opening_time?: string;
    closing_time?: string;
  };
};
