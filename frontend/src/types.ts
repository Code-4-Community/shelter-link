/**
 * Enum representing days of the week.
 */
export enum DayOfWeek {
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
}

export type User = {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
};

/**
 * Represents the model schema of a shelter.
 *
 * shelterId - The unique identifier of the shelter.
 * name - The name of the shelter.
 * expanded_name - The expanded name of the shelter.
 * address - The address of the shelter.
 * latitude - The latitude of the shelter.
 * longitude - The longitude of the shelter.
 * description - The description of the shelter.
 * rating - The rating of the shelter, a decimal number between (0, 5].
 * phone_number - The phone number of the shelter.
 * email_address - The email address of the shelter.
 * website - The website of the shelter.
 * hours - The hours of operation of the shelter. The key is the day of the week,
 *          which maps to the opening and closing times. If the shelter is closed on a particular
 *          day, the value is null.
 * picture - Picture(s) of the shelter.
 */
export type Shelter = {
  shelterId: string;
  expanded_name?: string;
  name: string;
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
  tags: {
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

export type NewUserInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: string; // Optional role field
  // If not provided, defaults to 'USER' in the backend.
};

export type UserModel = {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  role?: string;
};

export type LoginUserRequest = {
  body: {
    email: string;
    password: string;
  };
};

/**
 * Represents the schema of an event.
 *
 * eventId - The unique identifier of the event.
 * event_name - The name of the event.
 * description - The description of the event.
 * date - The datetime of the event.
 * host_name - The name of the host of the event. (Optional)
 * location - The location of the event. (Optional)
 * website - The website of the event. (Optional)
 * registration_link - The registration link of the event. (Optional)
 * phone_number - The phone number of the host. (Optional)
 * picture - Picture(s) of the event. (Optional)
 */
export type Event = {
  eventId: string;
  event_name: string;
  description: string;
  date: string;
  host_name?: string;
  location?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  website?: string;
  registration_link?: string;
  phone_number?: string;
  picture?: string[];
};

/**
 * bookmarkId: id of the shelter or event
 */
export type NewBookmarkInput = {
  userId: string;
  bookmarkId: string;
}