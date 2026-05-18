import type { CallAnalytics, CallMetric } from "@/lib/calls/types";
import { formatCallDuration } from "@/lib/calls/format-call-duration";

export function getCallMetrics(analytics: CallAnalytics): CallMetric[] {
  return [
    {
      id: "todays-calls",
      label: "Today's Calls",
      value: analytics.totalCalls,
      helperText: analytics.totalCalls == null ? "No data yet" : null,
    },
    {
      id: "answered",
      label: "Answered",
      value: analytics.answered,
      helperText: analytics.answered == null ? "No data yet" : null,
    },
    {
      id: "voicemails",
      label: "Voicemails",
      value: analytics.voicemails,
      helperText: analytics.voicemails == null ? "No data yet" : null,
    },
    {
      id: "avg-duration",
      label: "Avg. Duration",
      value: analytics.avgDurationSeconds == null ? null : formatCallDuration(analytics.avgDurationSeconds),
      helperText: analytics.avgDurationSeconds == null ? "No data yet" : null,
    },
  ];
}
