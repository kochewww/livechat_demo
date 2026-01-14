import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ErrorBanner } from "./ErrorBanner";
import { useChat } from "../model/ChatContext";
import { useUsername } from "../model/useUsername";

export const ChatMessages = () => {
  const { messages, status, error } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const username = useUsername();

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
            isOwn={message.user === username}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </>
  );
};
