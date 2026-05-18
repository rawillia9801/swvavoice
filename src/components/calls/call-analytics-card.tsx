import { BarChart3 } from "lucide-react";
import type { CallAnalytics } from "@/lib/calls/types";
import { formatCallDuration } from "@/lib/calls/format-call-duration";

type CallAnalyticsCardProps = {
  analytics: CallAnalytics;
};

export function CallAnalyticsCard({ analytics }: CallAnalyticsCardProps) {
  const rows = [
    ["Total Calls", analytics.totalCalls],
    ["Answered", analytics.answered],
    ["Missed", analytics.missed],
    ["Voicemails", analytics.voicemails],
    [
      "Avg. Duration",
      analytics.avgDurationSeconds == null ? null : formatCallDuration(analytics.avgDurationSeconds),
    ],
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Call Analytics (Today)</h2>
      <dl className="mt-4 divide-y divide-slate-100">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-3 text-sm">
            <dt className="text-slate-600">{label}</dt>
            <dd className="font-semibold text-slate-950">{value ?? "—"}</dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        disabled
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-violet-300 bg-white text-sm font-semibold text-violet-700 disabled:cursor-not-allowed disabled:opacity-55"
        title="Analytics view is not connected yet"
      >
        <BarChart3 className="size-4" aria-hidden="true" />
        View Full Analytics
      </button>
    </section>
  );
}
