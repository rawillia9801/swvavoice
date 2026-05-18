"use client";

import { X } from "lucide-react";
import { Dialpad } from "@/components/calls/dialpad";

type DialpadModalProps = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onCall: () => void;
  calling: boolean;
  message?: string | null;
};

export function DialpadModal({
  open,
  value,
  onChange,
  onClose,
  onCall,
  calling,
  message,
}: DialpadModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4">
      <section className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Dialpad</h2>
            <p className="text-sm text-slate-500">Place a real outbound Twilio Voice test call.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Close dialpad"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <Dialpad value={value} onChange={onChange} onCall={onCall} calling={calling} message={message} />
      </section>
    </div>
  );
}
