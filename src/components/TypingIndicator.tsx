import { Bot } from "lucide-react";

import LoadingSpinner from "@/components/LoadingSpinner";

export default function TypingIndicator() {
  return (
    <div className="flex animate-message-in items-start gap-3 px-4 pb-7 sm:px-7">
      <div className="flex w-10 shrink-0 flex-col items-center gap-1.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-green/30 bg-accent-green/10 text-accent-green shadow-[0_0_20px_rgba(0,255,65,0.08)]">
          <Bot size={18} aria-hidden="true" />
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-wider text-accent-green">
          Gemini
        </span>
      </div>
      <div className="rounded-2xl rounded-tl-md border border-border-dim border-l-accent-green/70 bg-bg-sidebar/75 px-4 py-3 shadow-lg">
        <LoadingSpinner />
      </div>
    </div>
  );
}
