import { ArrowUp, Paperclip } from "lucide-react";
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

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form
      className="border-t border-border-dim bg-bg-darker/85 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end gap-2 rounded-2xl border border-border-dim bg-bg-input p-2 shadow-[0_14px_40px_rgba(0,0,0,0.16)] transition focus-within:border-accent-cyan/50 focus-within:shadow-[0_0_0_3px_rgba(0,191,255,0.08)] sm:gap-3">
          <button
            type="button"
            disabled
            className="mb-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary/45 sm:flex"
            aria-label="Anexos indisponíveis nesta versão"
            title="Anexos em breve"
          >
            <Paperclip size={18} aria-hidden="true" />
          </button>
        <label className="sr-only" htmlFor="support-message">
          Pergunta técnica
        </label>
        <textarea
          id="support-message"
          autoComplete="off"
          rows={1}
          value={value}
          disabled={loading}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Descreva o problema técnico..."
          className="max-h-32 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-base leading-6 text-text-primary outline-none placeholder:text-text-secondary/65 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-green/35 bg-accent-green text-bg-darker shadow-[0_0_20px_rgba(0,255,65,0.12)] transition hover:-translate-y-0.5 hover:bg-accent-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green/60 disabled:translate-y-0 disabled:border-border-dim disabled:bg-bg-dark disabled:text-text-secondary/40 disabled:shadow-none"
          aria-label="Enviar mensagem"
        >
          <ArrowUp size={19} strokeWidth={2.5} aria-hidden="true" />
        </button>
        </div>
        <p className="mt-2 hidden text-center font-mono text-[0.6875rem] text-text-secondary/70 sm:block">
          Enter envia · Shift + Enter cria uma nova linha
        </p>
      </div>
    </form>
  );
}
