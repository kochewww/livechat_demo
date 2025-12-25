import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import type { ChatMessage as ChatMessageType, ChatStatus } from "@/types/chat";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  status: ChatStatus;
  currentUsername: string;
}

/**
 * Chat messages list component
 * 
 * Features:
 * - Auto-scrolls to latest message
 * - Shows loading state
 * - Shows empty state
 * - Renders all messages
 */
export const ChatMessages = ({
  messages,
  status,
  currentUsername,
}: ChatMessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isConnecting = status === "connecting";
  const isReady = status === "ready";
  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 md:px-4 md:py-4 space-y-2 md:space-y-3 min-h-0">
      {/* Loading state */}
      {isConnecting && (
        <div className="text-sm text-slate-300 text-center py-6">
          Connecting to Supabase...
        </div>
      )}

      {/* Empty state */}
      {isReady && isEmpty && (
        <div className="text-sm text-slate-400 text-center py-10">
          No messages — send the first one!
        </div>
      )}

      {/* Messages list */}
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isOwn={message.user === currentUsername}
        />
      ))}
      
      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};
