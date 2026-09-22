"use client";

import { Menu, Moon, Sparkles, Sun } from "lucide-react";

export type ThemeMode = "dark" | "light";

type HeaderProps = {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
};

export default function Header({
  theme,
  onToggleTheme,
  onToggleSidebar,
}: HeaderProps) {
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-border-dim/90 bg-bg-darker/90 px-4 shadow-[0_10px_35px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-dim bg-bg-sidebar text-text-secondary transition hover:border-accent-cyan/40 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/60 lg:hidden"
          aria-label="Abrir conversas"
        >
          <Menu size={19} aria-hidden="true" />
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-green/30 bg-accent-green/10 text-accent-green shadow-[0_0_22px_rgba(0,255,65,0.1)]">
          <Sparkles size={19} aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-bold tracking-tight text-text-primary">
              MyFriend
            </h1>
            <span className="hidden rounded-full border border-accent-green/20 bg-accent-green/8 px-2 py-0.5 font-mono text-[0.6875rem] font-medium text-accent-green sm:inline">
              online
            </span>
          </div>
          <nav
            aria-label="Breadcrumb"
            className="mt-0.5 flex items-center gap-1.5 text-xs text-text-secondary"
          >
            <span>Workspace</span>
            <span aria-hidden="true" className="text-border-dim">
              /
            </span>
            <span className="font-medium text-text-primary">chat</span>
          </nav>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
        aria-pressed={!isDark}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-dim bg-bg-sidebar text-text-secondary transition hover:border-accent-cyan/40 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/60"
      >
        {isDark ? (
          <Moon size={18} aria-hidden="true" />
        ) : (
          <Sun size={18} aria-hidden="true" />
        )}
      </button>
    </header>
  );
}
