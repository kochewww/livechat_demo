import { useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { ChatStatus } from "@/types/chat";
import { UI_CONFIG, PLACEHOLDERS, SUPABASE_CONFIG } from "@/constants/chat";

interface ChatInputProps {
  status: ChatStatus;
  username: string;
}

export const ChatInput = ({ status, username }: ChatInputProps) => {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isReady = status === "ready";
  const canSend = isReady && !sending && draft.trim().length > 0;

  const handleSend = async () => {
    if (!canSend || !supabase) return;

    setSending(true);
    try {
      const trimmedText = draft.trim();
      const { error: insertError } = await supabase
        .from(SUPABASE_CONFIG.TABLE_NAME)
        .insert({
          user: username,
          text: trimmedText,
        });

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        throw insertError;
      }

      setDraft("");
      resetTextareaHeight();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflow = "hidden";
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    const textarea = e.target;
    const maxHeight = UI_CONFIG.TEXTAREA_MAX_HEIGHT;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    if (textarea.scrollHeight <= maxHeight) {
      textarea.style.overflow = "hidden";
    } else {
      textarea.style.overflowY = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholder = isReady ? PLACEHOLDERS.READY : PLACEHOLDERS.WAITING;

  return (
    <div className="border-t border-white/10 bg-white/5 px-3 py-2 md:px-4 md:py-3 shrink-0 sticky bottom-0 z-10">
      <div className="flex gap-2 items-center">
        <textarea
          ref={textareaRef}
          rows={1}
          value={draft}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={!isReady}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/10 px-3 py-2 md:py-2.5 text-base md:text-base outline-none focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/60 placeholder:text-slate-400 disabled:opacity-60 max-h-[120px] overflow-hidden leading-relaxed"
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="shrink-0 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base font-semibold shadow-lg shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-colors h-[42px] md:h-auto min-w-[60px] md:min-w-[70px]"
        >
          {sending ? "..." : "Send"}
        </button>
      </div>
      <div className="text-[10px] md:text-xs text-slate-400 mt-1.5 md:mt-2 hidden sm:block">
        Enter — send, Shift+Enter — new line
      </div>
    </div>
  );
};
