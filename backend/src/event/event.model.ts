/**
 * Represents the schema of an event.
 *
 * @property eventId The unique identifier of the event.
 * @property event_name The name of the event.
 * @property description The description of the event.
 * @property date The datetime of the event.
 * @property host_name The name of the host of the event. (Optional)
 * @property location The location of the event. (Optional)
 * @property website The website of the event. (Optional)
 * @property registration_link The registration link of the event. (Optional)
 * @property phone_number The phone number of the host. (Optional)
 * @property picture Picture(s) of the event. (Optional)
 */
export type EventModel = {
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
