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

  subscribe(
    onInsert: (msg: ChatMessage) => void,
    onClear: () => void
  ) {
    const channel = supabase.channel(SUPABASE_CONFIG.CHANNEL_NAME);

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: SUPABASE_CONFIG.TABLE_NAME, // Listening specifically to messages table again
        },
        (payload) => {
          console.log("[chat.api] Realtime event received:", payload);
          if (payload.eventType === "INSERT") {
            onInsert(payload.new as ChatMessage);
          } else if (payload.eventType === "DELETE") {
            // Check if it's a "delete all" (often ID is null or check logic)
            // But here we basically just trigger a clear for any delete for simplicity as per previous logic
            // Or better, check the change. Previous logic was just "on DELETE -> clear".
            onClear();
          }
        }
      )
      .subscribe((status, error) => {
        console.log("Supabase Realtime status:", status);
        if (error) console.error("Supabase Realtime error:", error);
      });
    return () => {
      supabase.removeChannel(channel);
    };
  },

  async sendMessage(message: Omit<ChatMessage, "id">) {
    return supabase.from("messages").insert(message).select().single();
  },

  async clearMessages() {
    return supabase.from("messages").delete().not("id", "is", null);
  },
};
