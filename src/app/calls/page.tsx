import { CallsWorkspace } from "@/components/calls/calls-workspace";
import { getCallAnalytics } from "@/lib/calls/get-call-analytics";
import { getCallMetrics } from "@/lib/calls/get-call-metrics";
import { getCalls } from "@/lib/calls/get-calls";
import { getLiveCall } from "@/lib/calls/get-live-call";
import { callsQuickActions } from "@/lib/calls/quick-actions";
import { requireAppSession } from "@/lib/auth";

export default async function CallsPage() {
  await requireAppSession();

  const [calls, liveCall, analytics] = await Promise.all([
    getCalls(),
    getLiveCall(),
    getCallAnalytics(),
  ]);
  const metrics = getCallMetrics(analytics);

  return (
    <CallsWorkspace
      calls={calls}
      liveCall={liveCall}
      analytics={analytics}
      metrics={metrics}
      actions={callsQuickActions}
    />
  );
}
