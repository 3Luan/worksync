export interface MessageVisibility {
  id: number;
  message_id: number;
  user_id: number;
  visible: boolean;
  deleted_for_user: boolean;
  created_at: string;
  updated_at: string;
}
