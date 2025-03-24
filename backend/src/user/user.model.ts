/**
 * Represents the schema of a user.
 *
 * @property userId - The unique identifier of the user.
 * @property first_name - The first name of the user.
 * @property last_name - The last name of the user.
 * @property email - The email of the user.
 * @property created_at - The date and time the user was created.
 *
 */
export type UserModel = {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
};

export type UserInputModel = {
  userId: { S: string };
  first_name: { S: string };
  last_name: { S: string };
  email: { S: string };
  created_at: { S: string };
};
