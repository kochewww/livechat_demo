"use client";

import { useEffect, useState } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ErrorBanner } from "@/components/chat/ErrorBanner";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { supabase } from "@/lib/supabaseClient";
import type { ChatMessage, ChatStatus } from "@/types/chat";
import { SUPABASE_CONFIG, ERROR_MESSAGES, STORAGE_KEYS, UI_CONFIG } from "@/constants/chat";

export default function Home() {
  const [username, setUsername] = useState("You");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>(
    supabase ? "connecting" : "error"
  );
  const [error, setError] = useState<string | null>(
    supabase ? null : ERROR_MESSAGES.SUPABASE_NOT_CONFIGURED
  );

  // Initialize username
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlUser = urlParams.get("user");
    if (urlUser) {
      setUsername(urlUser);
      return;
    }

    const existingUsername = window.sessionStorage.getItem(STORAGE_KEYS.USERNAME);
    if (existingUsername) {
      setUsername(existingUsername);
      return;
    }

    const randomNumber = Math.floor(
      UI_CONFIG.USERNAME_MIN + Math.random() * (UI_CONFIG.USERNAME_MAX - UI_CONFIG.USERNAME_MIN + 1)
    );
    const generatedUsername = `${UI_CONFIG.USERNAME_PREFIX}${randomNumber}`;
    window.sessionStorage.setItem(STORAGE_KEYS.USERNAME, generatedUsername);
    setUsername(generatedUsername);
  }, []);

  // Initialize Supabase connection and subscribe to messages
  useEffect(() => {
    if (!supabase) return;

    let isSubscriptionActive = true;
    const supabaseClient = supabase;

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
          if (!isSubscriptionActive) return;
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    const loadExistingMessages = async () => {
      setStatus("connecting");
      const { data, error: loadError } = await supabaseClient
        .from(SUPABASE_CONFIG.TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: true })
        .limit(SUPABASE_CONFIG.MAX_MESSAGES);

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

    return () => {
      isSubscriptionActive = false;
      supabaseClient.removeChannel(realtimeChannel);
    };
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!supabase) {
      setError(ERROR_MESSAGES.SUPABASE_NOT_AVAILABLE);
      return;
    }

    const trimmedText = text.trim();
    if (!trimmedText) return;

    const { error: insertError } = await supabase
      .from(SUPABASE_CONFIG.TABLE_NAME)
      .insert({
        user: username,
        text: trimmedText,
      });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      setError(`${ERROR_MESSAGES.SEND_ERROR}: ${insertError.message}`);
      setStatus("error");
    }
  };

  const handleClearMessages = async () => {
    if (!supabase) {
      setError(ERROR_MESSAGES.SUPABASE_NOT_AVAILABLE);
      return;
    }

    if (!confirm("Are you sure you want to clear all messages?")) return;

    const { error: deleteError } = await supabase
      .from(SUPABASE_CONFIG.TABLE_NAME)
      .delete()
      .gte("created_at", "1970-01-01");

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      setError(`Clear error: ${deleteError.message}`);
      setStatus("error");
    } else {
      setMessages([]);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 flex flex-col md:items-center md:justify-center md:px-4 md:py-4">
      <div className="w-full h-full md:h-auto md:max-w-2xl md:max-h-[90vh] bg-white/10 border-0 md:border border-white/10 backdrop-blur-lg md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <ChatHeader status={status} username={username} onClear={handleClearMessages} />
        {status === "error" && <ErrorBanner error={error} />}
        <ChatMessages
          messages={messages}
          status={status}
          currentUsername={username}
        />
        <ChatInput status={status} onSend={handleSendMessage} />
      </div>
    </div>
  );
}
