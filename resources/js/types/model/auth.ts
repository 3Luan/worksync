import { User } from './user';

export interface Auth {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
  user: User;
}
