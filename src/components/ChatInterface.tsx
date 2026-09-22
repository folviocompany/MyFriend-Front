"use client";

import { Bot, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import ErrorAlert from "@/components/ErrorAlert";
import Header, { type ThemeMode } from "@/components/Header";
import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import TypingIndicator from "@/components/TypingIndicator";
import { askAssistant } from "@/lib/api-client";
import { getFriendlyErrorMessage } from "@/lib/errors";
import type { ChatMessage, ChatSession } from "@/lib/types";

const INITIAL_SESSION_ID = "initial-chat";

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: INITIAL_SESSION_ID,
    title: "Novo atendimento",
    messages: [],
  },
];

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

function createSession(): ChatSession {
  return {
    id: crypto.randomUUID(),
    title: "Novo atendimento",
    messages: [],
  };
}

function titleFromMessage(message: string): string {
  const normalized = message.replace(/\s+/g, " ").trim();
  return normalized.length > 38 ? `${normalized.slice(0, 38)}…` : normalized;
}

export default function ChatInterface() {
  const [sessions, setSessions] =
    useState<ChatSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] =
    useState(INITIAL_SESSION_ID);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [toast, setToast] = useState<string>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ?? sessions[0];
  const messages = activeSession?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [activeSessionId, messages.length, loading]);

  const closeError = useCallback(() => setError(undefined), []);
  const closeToast = useCallback(() => setToast(undefined), []);

  async function handleSend(message: string): Promise<void> {
    if (loading || !activeSession) {
      return;
    }

    const sessionId = activeSession.id;
    const userMessage = createMessage("user", message);

    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              title:
                session.messages.length === 0 &&
                session.title === "Novo atendimento"
                  ? titleFromMessage(message)
                  : session.title,
              messages: [...session.messages, userMessage],
              updatedAt: new Date(),
            }
          : session,
      ),
    );
    setInputValue("");
    setError(undefined);
    setLoading(true);

    try {
      const result = await askAssistant(message);
      const assistantMessage = createMessage(
        "assistant",
        result.response,
        result.provider,
      );

      setSessions((current) =>
        current.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                messages: [...session.messages, assistantMessage],
                updatedAt: new Date(),
              }
            : session,
        ),
      );
    } catch (requestError: unknown) {
      setError(getFriendlyErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  function handleNewChat(): void {
    const session = createSession();
    setSessions((current) => [session, ...current]);
    setActiveSessionId(session.id);
    setInputValue("");
    setError(undefined);
  }

  function handleDeleteChat(id: string): void {
    const remaining = sessions.filter((session) => session.id !== id);

    if (remaining.length === 0) {
      const replacement = createSession();
      setSessions([replacement]);
      setActiveSessionId(replacement.id);
      return;
    }

    setSessions(remaining);
    if (id === activeSessionId) {
      setActiveSessionId(remaining[0].id);
    }
  }

  function handleRenameChat(id: string, title: string): void {
    setSessions((current) =>
      current.map((session) =>
        session.id === id ? { ...session, title } : session,
      ),
    );
  }

  async function handleCopy(content: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(content);
      setToast("Copiado!");
    } catch {
      setError("Não foi possível copiar a resposta");
    }
  }

  return (
    <section
      aria-label="Assistente de suporte técnico"
      data-theme={theme}
      className="myfriend-shell flex h-dvh min-h-[36rem] flex-col overflow-hidden bg-bg-darker text-text-primary transition-colors duration-300"
    >
      <Header
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
        onToggleSidebar={() => setSidebarOpen((current) => !current)}
      />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          onSelectChat={setActiveSessionId}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
        />

        <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-bg-dark">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-dim/80 bg-bg-dark/85 px-4 backdrop-blur-lg sm:px-7">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">
                {activeSession?.title || "Novo atendimento"}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[0.6875rem] text-text-secondary">
                <Bot size={12} className="text-accent-green" aria-hidden="true" />
                <span>Gemini disponível</span>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-border-dim bg-bg-sidebar/70 px-3 py-1.5 font-mono text-[0.6875rem] text-text-secondary sm:flex">
              <ShieldCheck size={13} className="text-accent-green" aria-hidden="true" />
              sessão protegida
            </div>
          </div>

          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            aria-busy={loading}
          >
            <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col">
              <div className="min-h-0 flex-1">
                <MessageList messages={messages} onCopy={handleCopy} />
              </div>
              {loading ? <TypingIndicator /> : null}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <MessageInput
            value={inputValue}
            loading={loading}
            onValueChange={setInputValue}
            onSend={handleSend}
          />
        </section>
      </div>

      <ErrorAlert error={error} onClose={closeError} />
      <Toast message={toast} onClose={closeToast} />
    </section>
  );
}
