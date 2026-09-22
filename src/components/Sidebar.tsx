"use client";

import { MessageSquare, Plus, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";

import type { ChatSession } from "@/lib/types";

type SidebarProps = {
  sessions: ChatSession[];
  activeSessionId: string;
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  onDeleteChat: (id: string) => void;
};

function formatTimestamp(timestamp?: Date): string {
  if (!timestamp) {
    return "Agora";
  }

  return timestamp.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Sidebar({
  sessions,
  activeSessionId,
  open,
  onClose,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string>();
  const [draftTitle, setDraftTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const clickTimeoutRef = useRef<number | undefined>(undefined);

  function startEditing(session: ChatSession): void {
    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
    }
    setEditingId(session.id);
    setDraftTitle(session.title);
    window.requestAnimationFrame(() => inputRef.current?.select());
  }

  function selectSession(id: string): void {
    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = window.setTimeout(() => {
      onSelectChat(id);
      onClose();
    }, 220);
  }

  function saveTitle(): void {
    if (!editingId) {
      return;
    }

    const title = draftTitle.trim();
    if (title) {
      onRenameChat(editingId, title);
    }
    setEditingId(undefined);
  }

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Fechar painel de conversas"
          className="fixed inset-0 top-16 z-30 bg-bg-darker/75 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        aria-label="Conversas"
        className={`fixed inset-y-0 left-0 z-40 mt-16 flex w-[17rem] flex-col border-r border-border-dim bg-bg-sidebar shadow-2xl transition-transform duration-300 lg:static lg:mt-0 lg:w-[16rem] lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border-dim/80 px-4 py-4 lg:hidden">
          <p className="text-sm font-semibold text-text-primary">Conversas</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-bg-dark hover:text-text-primary"
            aria-label="Fechar conversas"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent-cyan/30 bg-accent-cyan/8 px-3 py-3 text-sm font-semibold text-accent-cyan transition hover:border-accent-cyan/60 hover:bg-accent-cyan/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/60"
          >
            <Plus size={17} aria-hidden="true" />
            Novo chat
          </button>
        </div>

        <div className="px-4 pb-2 pt-1">
          <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-text-secondary/80">
            Recentes
          </p>
        </div>

        <ol className="scrollbar-hidden min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-4">
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const isEditing = session.id === editingId;

            return (
              <li key={session.id} className="group relative">
                <div
                  className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 pr-10 text-left transition ${
                    isActive
                      ? "border-accent-cyan/25 bg-accent-cyan/10 shadow-[inset_3px_0_0_rgb(var(--accent-cyan))]"
                      : "border-transparent hover:border-border-dim hover:bg-bg-dark/70"
                  }`}
                >
                  <MessageSquare
                    size={16}
                    className={`mt-0.5 shrink-0 ${isActive ? "text-accent-cyan" : "text-text-secondary"}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        value={draftTitle}
                        onChange={(event) => setDraftTitle(event.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            saveTitle();
                          }
                          if (event.key === "Escape") {
                            event.preventDefault();
                            setEditingId(undefined);
                          }
                        }}
                        aria-label="Renomear conversa"
                        className="w-full rounded-md border border-accent-cyan/40 bg-bg-darker px-2 py-1 text-sm text-text-primary outline-none ring-2 ring-accent-cyan/15"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => selectSession(session.id)}
                        onDoubleClick={() => startEditing(session)}
                        className="block w-full truncate text-left text-sm font-medium text-text-primary focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50"
                      >
                        {session.title}
                      </button>
                    )}
                    <span className="mt-1 block font-mono text-[0.6875rem] text-text-secondary">
                      {formatTimestamp(session.updatedAt)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteChat(session.id);
                  }}
                  className="absolute right-3 top-3 rounded-lg p-1.5 text-text-secondary opacity-0 transition hover:bg-accent-error/10 hover:text-accent-error focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-error/50 group-hover:opacity-100"
                  aria-label={`Excluir conversa ${session.title}`}
                  title="Excluir"
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ol>

        <div className="border-t border-border-dim/80 px-4 py-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-accent-green shadow-[0_0_9px_rgba(0,255,65,0.65)]" />
            <span>Backend conectado</span>
          </div>
        </div>
      </aside>
    </>
  );
}
