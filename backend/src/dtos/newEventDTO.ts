export type NewEventInput = {
  // eventId: string; // Automatically generated
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
