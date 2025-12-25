import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { ChatMessage, ChatStatus } from "@/types/chat";
import { SUPABASE_CONFIG, ERROR_MESSAGES } from "@/constants/chat";

/**
 * Custom hook to manage Supabase chat connection and messages
 * 
 * Features:
 * - Loads initial messages from database
 * - Subscribes to real-time message inserts
 * - Provides sendMessage function
 * 
 * @returns Object with messages, status, error, and sendMessage function
 */
export const useSupabaseChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>(
    supabase ? "connecting" : "error"
  );
  const [error, setError] = useState<string | null>(
    supabase ? null : ERROR_MESSAGES.SUPABASE_NOT_CONFIGURED
  );

  useEffect(() => {
    // Early return if Supabase is not configured
    if (!supabase) {
      return;
    }

    let isSubscriptionActive = true;
    const supabaseClient = supabase;

    // Subscribe to real-time message inserts
    const realtimeChannel = supabaseClient
      .channel(SUPABASE_CONFIG.CHANNEL_NAME)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: SUPABASE_CONFIG.TABLE_NAME,
        },
        (payload) => {
          // Ignore if component unmounted
          if (!isSubscriptionActive) return;
          
          // Add new message to the list
          const newMessage = payload.new as ChatMessage;
          setMessages((previousMessages) => [...previousMessages, newMessage]);
        }
      )
      .subscribe();

    // Load existing messages from database
    const loadExistingMessages = async () => {
      setStatus("connecting");
      
      const { data, error: loadError } = await supabaseClient
        .from(SUPABASE_CONFIG.TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: true })
        .limit(SUPABASE_CONFIG.MAX_MESSAGES);

      // Ignore if component unmounted during async operation
      if (!isSubscriptionActive) return;

      if (loadError) {
        setStatus("error");
        setError(loadError.message);
        return;
      }

      setMessages(data ?? []);
      setStatus("ready");
    };

    loadExistingMessages();

    // Cleanup: unsubscribe from real-time updates
    return () => {
      isSubscriptionActive = false;
      supabaseClient.removeChannel(realtimeChannel);
    };
  }, []);

  /**
   * Send a new message to the chat
   * 
   * @param username - The username of the sender
   * @param text - The message text content
   * @throws Error if Supabase is not configured or insert fails
   */
  const sendMessage = async (username: string, text: string): Promise<void> => {
    if (!supabase) {
      setError(ERROR_MESSAGES.SUPABASE_NOT_AVAILABLE);
      throw new Error(ERROR_MESSAGES.SUPABASE_NOT_AVAILABLE);
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      return; // Don't send empty messages
    }

    const { error: insertError } = await supabase
      .from(SUPABASE_CONFIG.TABLE_NAME)
      .insert({
        user: username,
        text: trimmedText,
      });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      const errorMessage = `${ERROR_MESSAGES.SEND_ERROR}: ${insertError.message}`;
      setError(errorMessage);
      setStatus("error");
      throw insertError;
    }
  };

  /**
   * Clear all messages from the database
   * 
   * @throws Error if Supabase is not configured or delete fails
   */
  const clearMessages = async (): Promise<void> => {
    if (!supabase) {
      setError(ERROR_MESSAGES.SUPABASE_NOT_AVAILABLE);
      throw new Error(ERROR_MESSAGES.SUPABASE_NOT_AVAILABLE);
    }

    // Delete all messages from database
    // Using .neq() with impossible condition to delete all rows (works with RLS)
    const { error: deleteError } = await supabase
      .from(SUPABASE_CONFIG.TABLE_NAME)
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    
    // If delete succeeds, clear local state
    // Real-time subscription will handle updates from other clients

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      const errorMessage = `Clear error: ${deleteError.message}`;
      setError(errorMessage);
      setStatus("error");
      throw deleteError;
    }

    // Clear local state after successful deletion
    setMessages([]);
  };

  return { messages, status, error, sendMessage, clearMessages };
};
