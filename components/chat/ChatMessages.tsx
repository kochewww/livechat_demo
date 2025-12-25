import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ErrorBanner } from "./ErrorBanner";
import { supabase } from "@/lib/supabaseClient";
import type { ChatMessage as ChatMessageType, ChatStatus } from "@/types/chat";
import { SUPABASE_CONFIG, ERROR_MESSAGES } from "@/constants/chat";

interface ChatMessagesProps {
  currentUsername: string;
  onStatusChange?: (status: ChatStatus) => void;
  onClearRequest?: () => void;
}

export const ChatMessages = ({
  currentUsername,
  onStatusChange,
  onClearRequest,
}: ChatMessagesProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [status, setStatus] = useState<ChatStatus>(
    supabase ? "connecting" : "error"
  );
  const [error, setError] = useState<string | null>(
    supabase ? null : ERROR_MESSAGES.SUPABASE_NOT_CONFIGURED
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  }, [status, onStatusChange]);

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
          const newMessage = payload.new as ChatMessageType;
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

  useEffect(() => {
    if (onClearRequest) {
      const handleClear = async () => {
        if (!supabase) return;

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

      const handler = () => handleClear();
      document.addEventListener("clearMessages", handler);
      return () => document.removeEventListener("clearMessages", handler);
    }
  }, [onClearRequest]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isConnecting = status === "connecting";
  const isReady = status === "ready";
  const isEmpty = messages.length === 0;

  return (
    <>
      {status === "error" && <ErrorBanner error={error} />}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 md:px-4 md:py-4 space-y-2 md:space-y-3 min-h-0">
        {isConnecting && (
          <div className="text-sm text-slate-300 text-center py-6">
            Connecting to Supabase...
          </div>
        )}

        {isReady && isEmpty && (
          <div className="text-sm text-slate-400 text-center py-10">
            No messages — send the first one!
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwn={message.user === currentUsername}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </>
  );
};
