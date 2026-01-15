"use client";

import { ChatHeader } from "@/features/chat/ui/ChatHeader";
import { ChatMessages } from "@/features/chat/ui/ChatMessages";
import { ChatInput } from "@/features/chat/ui/ChatInput";
import { ChatContextProvider } from "@/features/chat/model/ChatContext";

export default function Home() {
  return (
    <div className="min-h-[100svh] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 flex flex-col md:items-center md:justify-center md:px-4 md:py-4">
      <div className="w-full flex-grow md:h-auto md:max-w-2xl md:max-h-[90vh] bg-white/10 border-0 md:border border-white/10 backdrop-blur-lg md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <ChatContextProvider>
          <ChatHeader />
          <ChatMessages />
          <ChatInput />
        </ChatContextProvider>
      </div>
    </div>
  );
}
