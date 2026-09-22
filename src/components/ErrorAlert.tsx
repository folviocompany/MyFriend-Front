"use client";

import { useEffect } from "react";

type ErrorAlertProps = {
  error: string | undefined;
  onClose: () => void;
};

export default function ErrorAlert({ error, onClose }: ErrorAlertProps) {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timeoutId = window.setTimeout(onClose, 5_000);
    return () => window.clearTimeout(timeoutId);
  }, [error, onClose]);

  if (!error) {
    return null;
  }

  return (
    <div
      role="alert"
      className="absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-4 rounded-xl border border-text-error/35 bg-[#2a111b]/95 px-4 py-3 text-sm text-text-error shadow-2xl backdrop-blur-md sm:inset-x-auto sm:right-4 sm:max-w-md"
    >
      <div>
        <p className="font-semibold">Falha na solicitação</p>
        <p className="mt-1 leading-5 text-[#ffb3b3]">{error}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md px-2 py-1 text-xs font-semibold text-text-error transition hover:bg-text-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-error/60"
        aria-label="Fechar alerta"
      >
        Fechar
      </button>
    </div>
  );
}
