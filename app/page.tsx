"use client";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { ErrorBanner } from "@/components/chat/ErrorBanner";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { useUsername } from "@/hooks/useUsername";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";

/**
 * Main chat page component
 * 
 * Orchestrates all chat components and manages:
 * - Username (via useUsername hook)
 * - Supabase connection and messages (via useSupabaseChat hook)
 * - Message sending
 */
export default function Home() {
  // Get current user's username (unique per tab)
  const username = useUsername();

  // Get chat state and functions from Supabase hook
  const { messages, status, error, sendMessage } = useSupabaseChat();

  /**
   * Handle sending a message
   * Wraps sendMessage to pass username automatically
   */
  const handleSendMessage = async (text: string) => {
    await sendMessage(username, text);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 flex flex-col md:items-center md:justify-center md:px-4 md:py-4">
      <div className="w-full h-full md:h-auto md:max-w-2xl md:max-h-[90vh] bg-white/10 border-0 md:border border-white/10 backdrop-blur-lg md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header with status and username */}
        <ChatHeader status={status} username={username} />

        {/* Error banner (only shown when status is error) */}
        {status === "error" && <ErrorBanner error={error} />}

        {/* Messages list */}
        <ChatMessages
          messages={messages}
          status={status}
          currentUsername={username}
        />

        {/* Input field */}
        <ChatInput status={status} onSend={handleSendMessage} />
      </div>
    </div>
  );
}
