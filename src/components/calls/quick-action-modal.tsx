"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { CallsQuickAction } from "@/lib/calls/types";

type QuickActionModalProps = {
  action: CallsQuickAction | null;
  onClose: () => void;
  onSaveNote: (note: string) => void;
};

export function QuickActionModal({ action, onClose, onSaveNote }: QuickActionModalProps) {
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!action) {
    return null;
  }

  const isNote = action.actionType === "add_call_note";

  const submit = () => {
    if (isNote && message.trim()) {
      onSaveNote(message.trim());
      setFeedback("Note saved locally on this page. Backend note saving is not connected yet.");
      setMessage("");
      return;
    }

    const labels: Record<CallsQuickAction["actionType"], string> = {
      send_sms: "SMS sending is not connected yet.",
      send_email: "Email sending is not connected yet.",
      create_zoho_task: "Zoho task creation is not connected yet.",
      add_call_note: "Enter a note before saving.",
      schedule_callback: "Callback scheduling is not connected yet.",
    };
    setFeedback(labels[action.actionType]);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">{action.label}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Close action"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {action.actionType === "send_sms" ? (
            <>
              <input className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" placeholder="Phone number" />
              <textarea className="min-h-28 w-full rounded-md border border-slate-200 p-3 text-sm" placeholder="Message body" value={message} onChange={(event) => setMessage(event.target.value)} />
            </>
          ) : action.actionType === "send_email" ? (
            <>
              <input className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" placeholder="Email address" />
              <input className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" placeholder="Subject" />
              <textarea className="min-h-28 w-full rounded-md border border-slate-200 p-3 text-sm" placeholder="Email body" value={message} onChange={(event) => setMessage(event.target.value)} />
            </>
          ) : action.actionType === "create_zoho_task" ? (
            <>
              <input className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" placeholder="Task title" />
              <textarea className="min-h-24 w-full rounded-md border border-slate-200 p-3 text-sm" placeholder="Task details" value={message} onChange={(event) => setMessage(event.target.value)} />
            </>
          ) : action.actionType === "schedule_callback" ? (
            <>
              <input className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" type="datetime-local" />
              <textarea className="min-h-24 w-full rounded-md border border-slate-200 p-3 text-sm" placeholder="Callback notes" value={message} onChange={(event) => setMessage(event.target.value)} />
            </>
          ) : (
            <textarea className="min-h-32 w-full rounded-md border border-slate-200 p-3 text-sm" placeholder="Call note" value={message} onChange={(event) => setMessage(event.target.value)} />
          )}
        </div>

        {feedback ? (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{feedback}</p>
        ) : null}

        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            Cancel
          </button>
          <button type="button" onClick={submit} className="rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white">
            {isNote ? "Save" : "Send"}
          </button>
        </div>
      </section>
    </div>
  );
}
