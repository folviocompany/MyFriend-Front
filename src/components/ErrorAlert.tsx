"use client";

import { AlertTriangle, X } from "lucide-react";
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
      className="fixed bottom-5 left-4 right-4 z-[70] flex animate-toast-in items-start gap-3 rounded-xl border border-accent-error/35 bg-[#2a111b]/95 px-4 py-3 text-sm text-accent-error shadow-[0_18px_55px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:left-auto sm:right-5 sm:max-w-md"
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">Falha na solicitação</p>
        <p className="mt-1 leading-5 text-[#ffb3b3]">{error}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1.5 text-accent-error transition hover:bg-accent-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-error/60"
        aria-label="Fechar alerta"
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
