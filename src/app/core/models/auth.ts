import { User } from './user';

export interface LoginRequest {
  username: string;  // email
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number; 
}

export interface AuthData {
  token: string;
  user: User;
  expiresAt: number; 
}