import { Request } from 'express';

/**
 * Enum representing days of the week.
 */
export enum DayOfWeek {
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
}

/**
 * Interface extending the request body when logging in an existing user, which contains:
 * - email - The email of the user.
 * - password - The password of the user.
 */
export interface LoginUserRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

/**
 * Enum representing user roles.
 * - USER - Regular user role.
 * - ADMIN - Administrator role.
 */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
