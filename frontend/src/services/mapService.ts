import { Shelter } from '../types';
import api from './config';

const SHELTER_API_URL = `${process.env.EXPO_PUBLIC_API_URL}/shelters`;

/**
 * Gets all the shelters from the database.
 *
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const getShelters = async (): Promise<[Shelter]> => {
  const res = await api.get(SHELTER_API_URL);
  if (res.status !== 200) {
    throw new Error('Error while fetching shelters');
  }
  return res.data;
};

export default getShelters;
