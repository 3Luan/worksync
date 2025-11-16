export interface ConversationSetting {
  id: number;
  conversation_id: number;
  theme_color: string | null;
  default_emoji: string | null;
  allow_reactions: boolean;
  allow_mentions: boolean;
  allow_media: boolean;
  created_at: string;
  updated_at: string;
}
