/**
 * Chat configuration constants
 */

// Storage keys
export const STORAGE_KEYS = {
  USERNAME: "livechat-demo-user",
} as const;

// Supabase configuration
export const SUPABASE_CONFIG = {
  CHANNEL_NAME: "public:messages",
  TABLE_NAME: "messages",
  MAX_MESSAGES: 300,
} as const;

// UI configuration
export const UI_CONFIG = {
  TEXTAREA_MAX_HEIGHT: 120,
  USERNAME_PREFIX: "demo-",
  USERNAME_MIN: 100,
  USERNAME_MAX: 999,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  SUPABASE_NOT_CONFIGURED:
    "Supabase env not configured: add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
  SUPABASE_NOT_AVAILABLE: "Supabase not configured",
  SEND_ERROR: "Send error",
} as const;

// Status text
export const STATUS_TEXT = {
  ONLINE: "Online",
  CONNECTING: "Connecting...",
  OFFLINE: "Offline",
} as const;

// Placeholder text
export const PLACEHOLDERS = {
  READY: "Type a message...",
  WAITING: "Waiting for Supabase connection...",
} as const;

