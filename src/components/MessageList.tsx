"use client";

import { Bot, Check, Copy, UserRound } from "lucide-react";
import { useState } from "react";

import ResponseDisplay from "@/components/ResponseDisplay";
import type { ChatMessage } from "@/lib/types";

type MessageListProps = {
  messages: ChatMessage[];
  onCopy: (content: string) => Promise<void>;
};

function formatTime(timestamp: Date): string {
  return timestamp.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageList({ messages, onCopy }: MessageListProps) {
  const [copiedId, setCopiedId] = useState<string>();

  async function copyMessage(message: ChatMessage): Promise<void> {
    await onCopy(message.content);
    setCopiedId(message.id);
    window.setTimeout(() => setCopiedId(undefined), 1_500);
  }

  if (messages.length === 0) {
    return (
      <div className="flex min-h-full items-center justify-center px-5 py-14 text-center">
        <div className="max-w-lg">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-green/30 bg-accent-green/10 text-accent-green shadow-[0_0_35px_rgba(0,255,65,0.1)]">
            <Bot size={25} aria-hidden="true" />
          </div>
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-green">
            Gemini pronto
          </p>
          <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            Qual cenário vamos investigar?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base leading-7 text-text-secondary">
            Informe o sintoma, os indicadores da ONU e os testes já realizados
            para receber um diagnóstico estruturado.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2 font-mono text-xs text-text-secondary">
            <span className="rounded-full border border-border-dim bg-bg-sidebar px-3 py-1.5">
              LOS na ONU
            </span>
            <span className="rounded-full border border-border-dim bg-bg-sidebar px-3 py-1.5">
              Sinal degradado
            </span>
            <span className="rounded-full border border-border-dim bg-bg-sidebar px-3 py-1.5">
              Sem autenticação
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ol
      aria-label="Mensagens da conversa"
      className="flex min-h-full flex-col justify-end gap-7 px-4 py-7 sm:px-7"
    >
      {messages.map((message) => {
        const isUser = message.role === "user";

        return (
          <li
            key={message.id}
            className={`flex animate-message-in items-start gap-3 ${
              isUser ? "flex-row-reverse justify-start" : "justify-start"
            }`}
          >
            <div className="flex w-10 shrink-0 flex-col items-center gap-1.5">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                  isUser
                    ? "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan"
                    : "border-accent-green/30 bg-accent-green/10 text-accent-green shadow-[0_0_20px_rgba(0,255,65,0.08)]"
                }`}
              >
                {isUser ? (
                  <UserRound size={17} aria-hidden="true" />
                ) : (
                  <Bot size={18} aria-hidden="true" />
                )}
              </span>
              <span
                className={`font-mono text-[0.625rem] uppercase tracking-wider ${
                  isUser ? "text-accent-cyan" : "text-accent-green"
                }`}
              >
                {isUser ? "Você" : message.provider || "Gemini"}
              </span>
            </div>

            <article
              className={`group/message relative w-fit max-w-[calc(100%-3.25rem)] rounded-2xl border px-4 py-3.5 shadow-lg sm:max-w-[78%] sm:px-5 sm:py-4 ${
                isUser
                  ? "rounded-tr-md border-accent-cyan/25 bg-accent-cyan/10 text-text-primary shadow-accent-cyan/5"
                  : "rounded-tl-md border-border-dim border-l-accent-green/70 bg-bg-sidebar/75 text-text-primary shadow-black/10"
              }`}
            >
              <header
                className={`mb-2.5 flex items-center gap-2 ${
                  isUser ? "justify-end" : "justify-between"
                }`}
              >
                <time className="font-mono text-[0.6875rem] text-text-secondary/80">
                  {formatTime(message.timestamp)}
                </time>
                {!isUser ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => void copyMessage(message)}
                      className="peer rounded-lg p-1.5 text-text-secondary opacity-100 transition hover:bg-bg-dark hover:text-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green/50 sm:opacity-0 sm:group-hover/message:opacity-100"
                      aria-label="Copiar resposta"
                      title="Copiar"
                    >
                      {copiedId === message.id ? (
                        <Check size={14} aria-hidden="true" />
                      ) : (
                        <Copy size={14} aria-hidden="true" />
                      )}
                    </button>
                    <span className="pointer-events-none absolute -top-8 right-0 rounded-md border border-border-dim bg-bg-darker px-2 py-1 text-[0.6875rem] text-text-primary opacity-0 shadow-lg transition peer-hover:opacity-100 peer-focus-visible:opacity-100">
                      Copiar
                    </span>
                  </div>
                ) : null}
              </header>
              <ResponseDisplay content={message.content} />
            </article>
          </li>
        );
      })}
    </ol>
  );
}
