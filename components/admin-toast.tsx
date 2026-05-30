"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";

export type AdminToastTone = "success" | "error";

export type AdminToastInput = {
  tone: AdminToastTone;
  title: string;
  message?: string;
};

export type AdminToast = AdminToastInput & {
  id: number;
};

type AdminToastStackProps = {
  toasts: AdminToast[];
  onDismiss: (id: number) => void;
};

export function AdminToastStack({ toasts, onDismiss }: AdminToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-[120] grid w-[min(92vw,24rem)] gap-3" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => {
        const Icon = toast.tone === "success" ? CheckCircle2 : AlertCircle;
        const toneClass =
          toast.tone === "success"
            ? "border-sage/25 bg-white text-sage"
            : "border-rust/25 bg-white text-rust";

        return (
          <div key={toast.id} className={`flex items-start gap-3 rounded-[1rem] border p-4 shadow-lift ${toneClass}`} role="status">
            <Icon aria-hidden size={20} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-espresso">{toast.title}</p>
              {toast.message ? <p className="mt-1 text-sm font-semibold leading-5 text-espresso/68">{toast.message}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-espresso/55 transition hover:bg-cream hover:text-rust"
              aria-label="Dismiss notification"
            >
              <X aria-hidden size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
