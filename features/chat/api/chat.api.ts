import { supabase } from "@/app/lib/supabaseClient";
import { ChatMessage } from "../model/chat.types";
import { SUPABASE_CONFIG } from "../model/consts";

export const chatApi = {
  async fetchMessages(limit: number) {
    return supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(limit);
  },

  subscribe(onInsert: (msg: ChatMessage) => void, onClear: () => void) {
    const channel = supabase.channel(SUPABASE_CONFIG.CHANNEL_NAME);

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: SUPABASE_CONFIG.TABLE_NAME,
        },
        (payload) => {
          onInsert(payload.new as ChatMessage);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: SUPABASE_CONFIG.TABLE_NAME,
        },
        () => {
          onClear();
        }
      )
      .subscribe((_status, error) => error && console.error(error));
    return () => {
      supabase.removeChannel(channel);
    };
  },

  async sendMessage(message: Omit<ChatMessage, "id">) {
    return supabase.from("messages").insert(message);
  },

  async clearMessages() {
    return supabase.from("messages").delete().neq("id", 0);
  },
};
