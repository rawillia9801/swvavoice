import type { CallAnalytics } from "@/lib/calls/types";

export async function getCallAnalytics(): Promise<CallAnalytics> {
  return {
    totalCalls: null,
    answered: null,
    missed: null,
    voicemails: null,
    avgDurationSeconds: null,
  };
}
