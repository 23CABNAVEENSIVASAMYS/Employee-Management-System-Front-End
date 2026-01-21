
export type Role = 'admin' | 'employee';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  dept: string;
  salary: number;
  joinDate: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  user: Employee | null;
}
