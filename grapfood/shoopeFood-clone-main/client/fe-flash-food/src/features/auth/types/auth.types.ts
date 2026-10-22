export type UserRole = 'customer' | 'merchant' | 'driver' | 'admin';

export interface User {
  id: string;
  name?: string;
  fullName?: string;
  email?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
