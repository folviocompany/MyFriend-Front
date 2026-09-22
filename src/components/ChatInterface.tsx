"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ErrorAlert from "@/components/ErrorAlert";
import LoadingSpinner from "@/components/LoadingSpinner";
import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import { askAssistant } from "@/lib/api-client";
import { getFriendlyErrorMessage } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";

function createMessage(
  role: ChatMessage["role"],
  content: string,
  provider?: string,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
    provider,
  };
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const closeError = useCallback(() => setError(undefined), []);

  async function handleSend(message: string): Promise<void> {
    if (loading) {
      return;
    }

    setMessages((current) => [...current, createMessage("user", message)]);
    setInputValue("");
    setError(undefined);
    setLoading(true);

    try {
      const result = await askAssistant(message);
      setMessages((current) => [
        ...current,
        createMessage("assistant", result.response, result.provider),
      ]);
    } catch (requestError: unknown) {
      setError(getFriendlyErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-label="Assistente de suporte técnico"
      className="relative flex h-[calc(100dvh-1.5rem)] max-h-[52rem] min-h-[34rem] w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] border border-border-dim bg-bg-dark/95 shadow-[0_32px_100px_rgba(0,0,0,0.55),0_0_60px_rgba(0,191,255,0.04)] sm:h-[calc(100dvh-3rem)]"
    >
      <ErrorAlert error={error} onClose={closeError} />

      <header className="flex items-center justify-between gap-4 border-b border-border-dim bg-bg-darker/80 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-text-success shadow-[0_0_10px_rgba(81,207,102,0.75)]"
              aria-hidden="true"
            />
            <h1 className="truncate text-sm font-semibold tracking-wide text-text-primary sm:text-base">
              ISP Support Assistant
            </h1>
          </div>
          <p className="mt-1 truncate text-xs text-text-secondary">
            Apoio técnico para analistas N1/N2
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-border-dim bg-bg-input px-3 py-1 text-xs text-text-secondary">
          sessão temporária
        </span>
      </header>

      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        aria-busy={loading}
      >
        <MessageList messages={messages} />
        {loading ? <LoadingSpinner /> : null}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        value={inputValue}
        loading={loading}
        onValueChange={setInputValue}
        onSend={handleSend}
      />
    </section>
  );
}
