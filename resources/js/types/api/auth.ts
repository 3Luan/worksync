export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ChangePasswordParams {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ForgotPasswordData {
  email: string;
}
