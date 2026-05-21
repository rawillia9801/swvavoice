"use client";

import { ArrowRight, Zap } from "lucide-react";
import { getIcon } from "@/components/icons";
import type { CallerRecord, QuickAction } from "@/lib/types";
import { useState } from "react";

type QuickActionsProps = {
  actions: QuickAction[];
  activeCaller?: CallerRecord | null;
};

const actionClass = {
  sms: "border-teal-200 bg-teal-50 text-teal-800",
  email: "border-blue-200 bg-blue-50 text-blue-800",
  "zoho-task": "border-violet-200 bg-violet-50 text-violet-800",
  "call-note": "border-amber-200 bg-amber-50 text-amber-800",
  callback: "border-rose-200 bg-rose-50 text-rose-800",
};

export function QuickActions({ actions, activeCaller }: QuickActionsProps) {
  const [notice, setNotice] = useState<string | null>(null);

  const saveCallNote = async () => {
    if (!activeCaller) {
      setNotice("No active caller selected.");
      return;
    }

    const body = window.prompt("Add call note");
    if (!body?.trim()) {
      return;
    }

    const response = await fetch("/api/call-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body,
        callId: activeCaller.id,
        phone: activeCaller.phone,
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string; savedTo?: string };

    if (!response.ok) {
      setNotice(payload.error || "Call note could not be saved.");
      return;
    }

    setNotice(`Call note saved to ${payload.savedTo || "Supabase"}. Refresh to see it in Call Notes.`);
  };

  const handleAction = (action: QuickAction) => {
    if (action.actionType === "sms") {
      if (!activeCaller?.phone) {
        setNotice("No active caller phone number available.");
        return;
      }
      window.location.assign(`/messages?phone=${encodeURIComponent(activeCaller.phone)}`);
      return;
    }

    if (action.actionType === "email") {
      if (!activeCaller?.email) {
        setNotice("No active caller email address available.");
        return;
      }
      window.location.assign(`mailto:${activeCaller.email}`);
      return;
    }

    if (action.actionType === "call-note") {
      void saveCallNote();
      return;
    }

    setNotice(`${action.label} is not connected to a backend workflow yet.`);
  };

  return (
    <section className="rounded-[10px] border border-[#eee7df] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Zap className="size-4 text-stone-500" aria-hidden="true" />
        <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700">Quick Actions</h2>
      </div>
      <div className="mt-3 space-y-1.5">
        {actions.map((action) => {
          const Icon = getIcon(action.icon);

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleAction(action)}
              className={`flex w-full items-center gap-3 rounded-md border px-3 py-1.5 text-left text-[12px] font-semibold transition hover:brightness-95 ${actionClass[action.actionType]}`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {action.label}
            </button>
          );
        })}
      </div>
      <a href="#" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-teal-700">
        View all actions <ArrowRight className="size-4" aria-hidden="true" />
      </a>
      {notice ? (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          {notice}
          <button type="button" onClick={() => setNotice(null)} className="ml-3 underline">
            Close
          </button>
        </div>
      ) : null}
    </section>
  );
}
