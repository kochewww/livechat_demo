import { useState, useLayoutEffect, useRef } from "react";
import { UI_CONFIG, PLACEHOLDERS } from "../model/consts";
import { useChat } from "../model/ChatContext";

export const ChatInput = () => {
  const { status, send } = useChat();

  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isReady = status === "ready";
  const canSend = isReady && !isSending && draft.trim().length > 0;

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${Math.min(
      el.scrollHeight,
      UI_CONFIG.TEXTAREA_MAX_HEIGHT
    )}px`;
  }, [draft]);

  const handleSend = async () => {
    if (!canSend) return;

    setIsSending(true);
    try {
      await send(draft.trim());
      setDraft("");
    } finally {
      setIsSending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/10 bg-white/5 px-3 py-2 md:px-4 md:py-3 shrink-0 sticky bottom-0 z-10">
      <div className="flex gap-2 items-center">
        <textarea
          ref={textareaRef}
          value={draft}
          placeholder={isReady ? PLACEHOLDERS.READY : PLACEHOLDERS.WAITING}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!isReady}
          rows={1}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/10 px-3 py-2 md:py-2.5 text-base md:text-base outline-none focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/60 placeholder:text-slate-400 disabled:opacity-60 max-h-[120px] overflow-hidden leading-relaxed"
        />

        <button
          disabled={!canSend}
          onClick={handleSend}
          className="shrink-0 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base font-semibold shadow-lg shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-colors h-[42px] md:h-auto min-w-[60px] md:min-w-[70px]"
        >
          {isSending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};
