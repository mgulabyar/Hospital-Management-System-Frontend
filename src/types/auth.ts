export interface User {
  user_id: string;
  name: string;
  email: string;
  role_category: 'Admin_Control' | 'Front_Desk' | 'Clinical_Medical' | 'Clinical_Support';
  specific_role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}