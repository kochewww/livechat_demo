export type ChatMessage = {
  id: string; // uuid
  user: string | null;
  text: string | null;
  created_at: string | null;
};

export type ChatStatus = "connecting" | "ready" | "error";

