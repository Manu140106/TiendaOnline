export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'seller' | 'buyer';
  avatar?: string;
  createdAt?: Date;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'seller' | 'buyer';
  phone?: string;
  address?: string;
}

export interface UpdateUserRequest {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'seller' | 'buyer';
  phone?: string;
  address?: string;
  isActive?: boolean;
}