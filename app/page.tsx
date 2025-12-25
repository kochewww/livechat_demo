"use client";

import { useEffect, useState } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { STORAGE_KEYS, UI_CONFIG } from "@/constants/chat";
import type { ChatStatus } from "@/types/chat";

export default function Home() {
  const [username, setUsername] = useState("You");
  const [status, setStatus] = useState<ChatStatus>("connecting");

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

  const handleStatusChange = (newStatus: ChatStatus) => {
    setStatus(newStatus);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 flex flex-col md:items-center md:justify-center md:px-4 md:py-4">
      <div className="w-full h-full md:h-auto md:max-w-2xl md:max-h-[90vh] bg-white/10 border-0 md:border border-white/10 backdrop-blur-lg md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <ChatHeader status={status} username={username} />
        <ChatMessages
          currentUsername={username}
          onStatusChange={handleStatusChange}
          onClearRequest={() => {}}
        />
        <ChatInput status={status} username={username} />
      </div>
    </div>
  );
}
