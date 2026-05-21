import type { CallStatus } from "@/lib/calls/types";

type CallStatusBadgeProps = {
  status: CallStatus;
};

const statusLabel: Record<CallStatus, string> = {
  active: "Active Call",
  completed: "Completed",
  voicemail: "Voicemail",
  missed: "Missed",
  failed: "Failed",
  unknown: "Unknown",
};

const statusClass: Record<CallStatus, string> = {
  active: "bg-green-50 text-green-700",
  completed: "bg-slate-100 text-slate-700",
  voicemail: "bg-violet-50 text-violet-700",
  missed: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
  unknown: "bg-slate-100 text-slate-700",
};

export function CallStatusBadge({ status }: CallStatusBadgeProps) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[status]}`}>
      {statusLabel[status]}
    </span>
  );
}
