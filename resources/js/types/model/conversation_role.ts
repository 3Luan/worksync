export interface ConversationRole {
  id: number;
  conversation_id: number;
  user_id: number;
  role: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}
