import { useRef, useState } from "react";
import type { ChatStatus } from "@/types/chat";
import { UI_CONFIG, PLACEHOLDERS } from "@/constants/chat";

interface ChatInputProps {
  status: ChatStatus;
  onSend: (text: string) => Promise<void>;
}

/**
 * Chat input component with auto-resizing textarea
 * 
 * Features:
 * - Auto-resizes textarea as user types (max 120px)
 * - Enter to send, Shift+Enter for new line
 * - Disabled when not connected
 */
export const ChatInput = ({ status, onSend }: ChatInputProps) => {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isReady = status === "ready";
  const canSend = isReady && !sending && draft.trim().length > 0;

  /**
   * Handle sending the message
   */
  const handleSend = async () => {
    if (!canSend) return;

    setSending(true);
    try {
      await onSend(draft);
      setDraft("");
      resetTextareaHeight();
    } catch {
      // Error handling is done in the parent component
    } finally {
      setSending(false);
    }
  };

  /**
   * Reset textarea to initial height after sending
   */
  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflow = "hidden";
    }
  };

  /**
   * Auto-resize textarea based on content
   */
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    
    const textarea = e.target;
    const maxHeight = UI_CONFIG.TEXTAREA_MAX_HEIGHT;
    
    // Reset height to calculate new scroll height
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    
    // Show scrollbar only when content exceeds max height
    if (textarea.scrollHeight <= maxHeight) {
      textarea.style.overflow = "hidden";
    } else {
      textarea.style.overflowY = "auto";
    }
  };

  /**
   * Handle keyboard shortcuts
   * - Enter: send message
   * - Shift+Enter: new line
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholder = isReady ? PLACEHOLDERS.READY : PLACEHOLDERS.WAITING;

  return (
    <div className="border-t border-white/10 bg-white/5 px-3 py-2 md:px-4 md:py-3 shrink-0">
      <div className="flex gap-2 items-center">
        <textarea
          ref={textareaRef}
          rows={1}
          value={draft}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={!isReady}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/10 px-3 py-2 md:py-2.5 text-sm md:text-base outline-none focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/60 placeholder:text-slate-400 disabled:opacity-60 max-h-[120px] overflow-hidden leading-relaxed"
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
