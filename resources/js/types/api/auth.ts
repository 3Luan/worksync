export interface LoginPayload {
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
