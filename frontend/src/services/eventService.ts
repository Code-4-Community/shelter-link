import { Event } from '../types';
import api from './config';

const SHELTER_API_URL = `${process.env.EXPO_PUBLIC_API_URL}/events`;

/**
 * Gets all the events from the database.
 *
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const getEvents = async (): Promise<[Event]> => {
  const res = await api.get(SHELTER_API_URL);

  if (res.status !== 200) {
    throw new Error('Error while fetching events');
  }
  return res.data;
};

export default getEvents;