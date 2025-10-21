export interface Attachment {
  id: number;
  message_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  thumbnail_url?: string | null;
  created_at: string;
  updated_at: string;
}
