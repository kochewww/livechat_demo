import { createContext, useContext, useEffect, useState } from "react";
import { chatApi } from "../api/chat.api";
import { ChatMessage, ChatStatus } from "./chat.types";
import { useUsername } from "./useUsername";

const MAX_MESSAGES = 100;

type ChatContextValue = {
  messages: ChatMessage[];
  status: ChatStatus;
  send: (text: string) => Promise<void>;
  clear: () => Promise<void>;
  error: null | string;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("connecting");
  const [error, setError] = useState<string | null>(null);

  const username = useUsername();

  // initial load
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("connecting");

      const { data, error } = await chatApi.fetchMessages(MAX_MESSAGES);

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setStatus("error");
        return;
      }

      setMessages(data ?? []);
      setStatus("ready");
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // realtime subscribe
  useEffect(() => {
    const unsubscribe = chatApi.subscribe(
      (msg) => {
        setMessages((prev) => [...prev, msg]);
      },
      () => {
        setMessages([]);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  async function send(text: string) {
    if (!username || !text.trim()) return;

    const { error } = await chatApi.sendMessage({
      text,
      user: username,
      created_at: new Date().toISOString(),
    });

    if (error) {
      setError(error.message);
      setStatus("error");
    }
  }

  async function clear() {
    await chatApi.clearMessages();
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        status,
        error,
        send,
        clear,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be inside <ChatProvider>");
  return ctx;
}
