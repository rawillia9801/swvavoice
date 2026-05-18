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

export function CallStatusBadge({ status }: CallStatusBadgeProps) {
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      {statusLabel[status]}
    </span>
  );
}
