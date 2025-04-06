import { Event, NewBookmarkInput } from '../types';
import api from './config';

const SHELTER_API_URL = `${process.env.EXPO_PUBLIC_API_URL}/events`;
const SHELTER_API_URL_BOOKMARK = `${process.env.EXPO_PUBLIC_API_URL}/bookmarks/event`;

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

const postBookmark = async (userId: string, eventId: string) => {
  const body: NewBookmarkInput = {
    userId,
    bookmarkId: eventId
  }
  const res = await api.post(SHELTER_API_URL_BOOKMARK, body);

  return res.data;
}

const deleteBookmark = async (userId: string, eventId: string) => {
  const body: NewBookmarkInput = {
    userId,
    bookmarkId: eventId
  }

  // Note: for delete body is added as part of config param
  const res = await api.delete(SHELTER_API_URL_BOOKMARK, { data: body });

  return res.data;
}


export { getEvents, postBookmark, deleteBookmark };