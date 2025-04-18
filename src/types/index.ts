export enum Effect {
  NONE = 'none',
  SHAKE = 'shake',
  RIPPLE = 'ripple',
  JITTER = 'jitter',
  PULSE = 'pulse',
  WAVE = 'wave',
}

export interface TextConfig {
  text: string;
  effect: Effect;
  color: string;
  fontSize: number;
  fontFamily: string;
  spacing: number;
  repeat: number; // Number of times to repeat the text
  // Text Formatting
  isBold: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
}

export interface LinkRecord {
  id: string;
  config: TextConfig;
  created_at: Date;
  expires_at: Date | null;
  view_count: number;
  user_id: string | null;
} 