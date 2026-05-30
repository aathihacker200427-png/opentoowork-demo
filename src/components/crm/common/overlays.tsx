"use client";

import { useState } from "react";
import { useCRM } from "../store";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({ open, title, message, onConfirm, onClose }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-xl border border-border shadow-xl w-full max-w-sm p-6">
        <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 h-9 rounded-md border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 h-9 rounded-md bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToastStack() {
  const { toasts, removeToast } = useCRM();
  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-lg border shadow-lg px-4 py-3 text-sm font-medium max-w-sm animate-in slide-in-from-right-4 fade-in-0 ${
            t.type === "success" ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" :
            t.type === "error" ? "bg-destructive/10 border-destructive/20 text-destructive" :
            t.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300" :
            "bg-card border-border text-foreground"
          }`}
        >
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="text-current opacity-60 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
