import { formatTime } from "@/features/chat/model/formatTime";
import type { ChatMessage as ChatMessageType } from "@/features/chat/model/chat.types";

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn: boolean;
}

export const ChatMessage = ({ message, isOwn }: ChatMessageProps) => {
  const authorName = isOwn ? "You" : message.user || "Anonymous";
  const messageText = message.text ?? "";

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-3 py-2 md:px-3 md:py-2 shadow-sm ${
          isOwn
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-white/10 text-slate-50 border border-white/5 rounded-bl-sm"
        }`}
      >
        <div className="text-[10px] md:text-xs opacity-80 mb-0.5 md:mb-1">
          {authorName}
        </div>

        <div className="text-sm md:text-base whitespace-pre-line break-words">
          {messageText}
        </div>

        <div className="text-[10px] md:text-[11px] opacity-60 mt-0.5 md:mt-1">
          {formatTime(message.created_at)}
        </div>
      </div>
    </div>
  );
};
