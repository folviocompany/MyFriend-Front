export default function LoadingSpinner() {
  return (
    <div
      aria-label="O assistente está elaborando a resposta"
      aria-live="polite"
      className="flex items-center gap-3 px-5 pb-5 text-sm text-text-accent sm:px-7"
    >
      <span className="flex items-center gap-1" aria-hidden="true">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 animate-pulse rounded-full bg-text-accent shadow-[0_0_10px_rgba(0,255,65,0.55)]"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
      <span>Gemini analisando</span>
    </div>
  );
}
