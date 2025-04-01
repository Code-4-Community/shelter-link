/**
 * Represents the schema of a user's shelter bookmarks
 */
export type UserShelterBookmarkModel = {
  userId: string;
  shelterId: string;
  created_at: string;
};

/**
 * Represents the schema of a user's shelter bookmarks suitable for DynamoDB.
 */
export type UserShelterBookmarkInputModel = {
  userId: { S: string };
  shelterId: { S: string };
  created_at: { S: string };
};

/**
 * Represents the schema of a user's event bookmarks
 */
export type UserEventBookmarkModel = {
  userId: string;
  eventId: string;
  created_at: string;
};

/**
 * Represents the schema of a user's event bookmarks suitable for DynamoDB.
 */
export type UserEventBookmarkInputModel = {
  userId: { S: string };
  eventId: { S: string };
  created_at: { S: string };
};
