export type NewUserInput = {
  // userId: string; // auto generated
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: string; // optional, defaults to USER
  // created_at: string; // auto generated
};
