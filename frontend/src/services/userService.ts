import {
  NewUserInput,
  UserModel,
  LoginUserRequest,
  UserShelterBookmark,
  UserEventBookmark,
} from '../types';
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

/**
 * Fetches the user's bookmarked shelters.
 *
 * @param userId The ID of the user.
 * @returns The list of bookmarked shelters.
 * @throws Error if the response status is not 200.
 */
const getShelterBookmarks = async (userId: string): Promise<any> => {
  const res = await api.get(
    `${USER_API_URL}/bookmarks/${userId}/?type=shelter`
  );
  if (res.status !== 200) {
    throw new Error('Error while fetching shelter bookmarks');
  }
  return res.data;
};

/**
 * Fetches the user's bookmarked events.
 *
 * @param userId The ID of the user.
 * @returns The list of bookmarked events.
 * @throws Error if the response status is not 200.
 */
const getEventBookmarks = async (userId: string): Promise<any> => {
  const res = await api.get(`${USER_API_URL}/bookmarks/${userId}/?type=event`);
  if (res.status !== 200) {
    throw new Error('Error while fetching event bookmarks');
  }
  return res.data;
};

/**
 * Post a new bookmark for a shelter or event.
 *
 * @param userId The ID of the user.
 * @param bookmarkId The ID of the bookmark.
 * @param type The type of the bookmark (shelter or event).
 * @returns The response data from the API.
 * @throws Error if the response status is not 200 or 201.
 */

const postBookmark = async (
  userId: string,
  bookmarkId: string,
  type: 'shelter' | 'event'
): Promise<UserShelterBookmark | UserEventBookmark> => {
  try {
    const res = await api.post(`${USER_API_URL}/bookmarks/${type}`, {
      body: {
        userId: userId,
        bookmarkId: bookmarkId,
      },
    });
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Error while creating bookmark');
    }
    return res.data;
  } catch (e) {
    throw new Error('Error creating bookmark');
  }
};

/**
 * Deletes a bookmark for a shelter or event.
 *
 * @param userId The ID of the user.
 * @param bookmarkId The ID of the bookmark.
 * @param type The type of the bookmark (shelter or event).
 * @returns The response data from the API.
 * @throws Error if the response status is not 200 or 201.
 */
const deleteBookmark = async (
  userId: string,
  bookmarkId: string,
  type: 'shelter' | 'event'
): Promise<any> => {
  try {
    const res = await api.delete(`${USER_API_URL}/bookmarks/${type}`, {
      data: {
        body: {
          userId: userId,
          bookmarkId: bookmarkId,
        },
      },
    });
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Error while deleting bookmark');
    }
    return res.data;
  } catch (e) {
    throw new Error('Error deleting bookmark');
  }
};

export {
  createUser,
  loginUser,
  getShelterBookmarks,
  getEventBookmarks,
  deleteBookmark,
  postBookmark,
};
