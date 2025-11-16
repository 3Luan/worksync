export interface Device {
  id: number;
  user_id: number;
  device_type: 'web' | 'mobile' | 'desktop';
  device_token: string | null;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}
