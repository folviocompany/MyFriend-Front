"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

type ToastProps = {
  message: string | undefined;
  onClose: () => void;
};

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(onClose, 3_000);
    return () => window.clearTimeout(timeoutId);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      className="fixed bottom-5 right-5 z-[70] flex animate-toast-in items-center gap-3 rounded-xl border border-accent-green/30 bg-bg-sidebar/95 px-4 py-3 text-sm font-medium text-text-primary shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    >
      <CheckCircle2 size={18} className="text-accent-green" aria-hidden="true" />
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-1 rounded-md p-1 text-text-secondary transition hover:bg-bg-dark hover:text-text-primary"
        aria-label="Fechar notificação"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
