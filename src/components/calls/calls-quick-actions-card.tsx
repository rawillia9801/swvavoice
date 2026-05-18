"use client";

import { CalendarClock, FilePenLine, ListChecks, Mail, MessageSquare } from "lucide-react";
import type { CallsQuickAction } from "@/lib/calls/types";

const iconByAction = {
  send_sms: MessageSquare,
  send_email: Mail,
  create_zoho_task: ListChecks,
  add_call_note: FilePenLine,
  schedule_callback: CalendarClock,
};

type CallsQuickActionsCardProps = {
  actions: CallsQuickAction[];
  onAction: (action: CallsQuickAction) => void;
};

export function CallsQuickActionsCard({ actions, onAction }: CallsQuickActionsCardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Quick Actions</h2>
      <div className="mt-4 space-y-2">
        {actions.map((action) => {
          const Icon = iconByAction[action.actionType];

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onAction(action)}
              className="flex h-10 w-full items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-left text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
              title={action.enabled ? action.label : "Not connected yet"}
            >
              <Icon className="size-4 text-violet-600" aria-hidden="true" />
              {action.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
