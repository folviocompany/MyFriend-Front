export default function LoadingSpinner() {
  return (
    <div
      aria-label="O assistente está elaborando a resposta"
      aria-live="polite"
      className="flex items-center gap-3 text-sm text-text-primary"
    >
      <span className="flex items-center gap-1.5" aria-hidden="true">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 animate-dot-pulse rounded-full bg-accent-green shadow-[0_0_9px_rgba(0,255,65,0.55)]"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
      <span>Gemini está pensando...</span>
    </div>
  );
}
