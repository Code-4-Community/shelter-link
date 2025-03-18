/**
 * Represents the schema of a user.
 *
 * @property userId - The unique identifier of the user.
 * @property first_name - The first name of the user.
 * @property last_name - The last name of the user.
 * @property email - The email of the user.
 *
 */
export type UserModel = {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type UserInputModel = {};
