import ResponseDisplay from "@/components/ResponseDisplay";
import type { ChatMessage } from "@/lib/types";

type MessageListProps = {
  messages: ChatMessage[];
};

function formatTime(timestamp: Date): string {
  return timestamp.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex min-h-full items-center justify-center px-5 py-12 text-center">
        <div className="max-w-md">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-text-accent/30 bg-text-accent/5 text-xl text-text-accent shadow-[0_0_30px_rgba(0,255,65,0.08)]">
            &gt;_
          </div>
          <h2 className="text-base font-semibold text-text-primary">
            Como posso ajudar no diagnóstico?
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Descreva o sintoma, os indicadores e as verificações já realizadas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ol
      aria-label="Mensagens da conversa"
      className="flex min-h-full flex-col justify-end gap-5 p-4 sm:p-6"
    >
      {messages.map((message) => {
        const isUser = message.role === "user";

        return (
          <li
            key={message.id}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <article
              className={`w-fit max-w-[88%] rounded-2xl border px-4 py-3 shadow-lg sm:max-w-[78%] sm:px-5 ${
                isUser
                  ? "rounded-br-md border-text-info/25 bg-text-info/8 text-text-info shadow-text-info/5"
                  : "rounded-bl-md border-text-accent/25 bg-text-accent/6 text-text-accent shadow-text-accent/5"
              }`}
            >
              <header className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em]">
                <span
                  className={
                    isUser
                      ? "text-text-info/80"
                      : "rounded-full border border-text-accent/25 bg-text-accent/10 px-2 py-0.5 text-text-accent"
                  }
                >
                  {isUser ? "Você" : message.provider || "gemini"}
                </span>
                <time className="text-text-secondary/70">
                  {formatTime(message.timestamp)}
                </time>
              </header>
              <ResponseDisplay content={message.content} />
            </article>
          </li>
        );
      })}
    </ol>
  );
}
