export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, any> | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}
