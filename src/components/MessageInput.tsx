import type { KeyboardEvent } from "react";

type MessageInputProps = {
  value: string;
  loading: boolean;
  onValueChange: (value: string) => void;
  onSend: (message: string) => Promise<void>;
};

export default function MessageInput({
  value,
  loading,
  onValueChange,
  onSend,
}: MessageInputProps) {
  const canSend = value.trim().length > 0 && !loading;

  async function handleSubmit(): Promise<void> {
    if (!canSend) {
      return;
    }

    await onSend(value.trim());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form
      className="border-t border-border-dim bg-bg-darker/85 p-3 backdrop-blur-xl sm:p-4"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      <div className="flex items-center gap-2 rounded-2xl border border-border-dim bg-bg-input p-2 shadow-inner transition focus-within:border-text-info/50 focus-within:shadow-[0_0_0_3px_rgba(0,191,255,0.08)] sm:gap-3">
        <label className="sr-only" htmlFor="support-message">
          Pergunta técnica
        </label>
        <input
          id="support-message"
          type="text"
          autoComplete="off"
          value={value}
          disabled={loading}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua pergunta técnica..."
          className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-base text-text-primary outline-none placeholder:text-text-secondary/65 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="shrink-0 rounded-xl border border-text-accent/35 bg-text-accent/10 px-4 py-2.5 text-sm font-semibold text-text-accent transition hover:border-text-accent/70 hover:bg-text-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-accent/60 disabled:cursor-not-allowed disabled:border-border-dim disabled:bg-transparent disabled:text-text-secondary/45 sm:px-5"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
