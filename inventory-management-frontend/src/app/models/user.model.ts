export interface User {
  id?: number;
  name?: string;
  email: string;
  password?: string;
  role?: string;
  created_At?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
