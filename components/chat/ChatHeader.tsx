import { supabase } from "@/lib/supabaseClient";
import type { ChatStatus } from "@/types/chat";
import { STATUS_TEXT, SUPABASE_CONFIG } from "@/constants/chat";

interface ChatHeaderProps {
  status: ChatStatus;
  username: string;
}

export const ChatHeader = ({ status, username }: ChatHeaderProps) => {
  const getStatusDisplayText = (): string => {
    switch (status) {
      case "ready":
        return STATUS_TEXT.ONLINE;
      case "connecting":
        return STATUS_TEXT.CONNECTING;
      default:
        return STATUS_TEXT.OFFLINE;
    }
  };

  const getNewTabUrl = (): string => {
    if (typeof window === "undefined") return "#";
    return `${window.location.origin}${window.location.pathname}`;
  };

  const handleClear = async () => {
    if (!supabase) {
      console.error("Supabase not available");
      return;
    }

    if (!confirm("Are you sure you want to clear all messages?")) return;

    const { error: deleteError } = await supabase
      .from(SUPABASE_CONFIG.TABLE_NAME)
      .delete()
      .gte("created_at", "1970-01-01");

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
    } else {
      document.dispatchEvent(new CustomEvent("clearMessages"));
    }
  };

  return (
    <div className="flex items-center justify-between px-3 py-2.5 md:px-5 md:py-4 border-b border-white/10 shrink-0">
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm md:text-base truncate">
            Live Chat Demo
          </div>
          <div className="text-[10px] md:text-xs text-emerald-300 flex items-center gap-1">
            <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">{getStatusDisplayText()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="text-[10px] md:text-xs text-slate-300 hidden sm:block">
          You: {username}
        </div>
        {status === "ready" && (
          <button
            onClick={handleClear}
            className="text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 transition-colors whitespace-nowrap"
            title="Clear all messages"
          >
            Clear
          </button>
        )}
        <a
          href={getNewTabUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 transition-colors cursor-pointer inline-block whitespace-nowrap"
          title="Open new tab with a different user to test multi-user chat"
        >
          <span className="hidden sm:inline">New User Tab</span>
          <span className="sm:hidden">New Tab</span>
        </a>
      </div>
    </div>
  );
};
