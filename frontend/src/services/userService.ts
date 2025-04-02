import { NewUserInput, UserModel, LoginUserRequest } from '../types';
import api from './config';

const USER_API_URL = `${process.env.EXPO_PUBLIC_API_URL}/users`;

/**
 * Creates a new user.
 *
 * @param userData The new user's data.
 * @returns The response data from the API.
 * @throws Error if the response status is not 200 or 201.
 */
const createUser = async (userData: NewUserInput): Promise<any> => {
  try {
    const res = await api.post(USER_API_URL, userData);
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Error while creating user');
    }
    return res.data.user;
  } catch (e) {
    throw new Error('Error creating user');
  }
};

/**
 * Logs in a user.
 *
 * @param loginData The login data containing email and password.
 * @returns The logged in user's data.
 * @throws Error if the response status is not 200.
 *
 * Note: This uses a GET request with a request body to match our backend controller.
 * While sending a body with GET is unconventional and it should be post instead, it still works.
 */
const loginUser = async (loginData: LoginUserRequest): Promise<UserModel> => {
  const res = await api.post(`${USER_API_URL}/login`, loginData);

  if (res.status !== 201) {
    throw new Error('Error while logging in user');
  }
  return res.data;
};

export { createUser, loginUser };
