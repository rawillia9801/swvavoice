import type { CallAnalytics } from "@/lib/calls/types";
import { getTwilioRestClient } from "@/lib/twilio/server-client";

export async function getCallAnalytics(): Promise<CallAnalytics> {
  const emptyAnalytics = {
    totalCalls: null,
    answered: null,
    missed: null,
    voicemails: null,
    avgDurationSeconds: null,
  };
  const client = getTwilioRestClient();

  if (!client) {
    return emptyAnalytics;
  }

  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const calls = await client.calls.list({
      startTimeAfter: startOfToday,
      limit: 1000,
      pageSize: 100,
    });

    const answeredCalls = calls.filter((call) => call.status === "completed");
    const missedCalls = calls.filter((call) =>
      ["busy", "no-answer", "canceled", "failed"].includes(call.status),
    );
    const durations = answeredCalls
      .map((call) => Number.parseInt(call.duration || "", 10))
      .filter((duration) => Number.isFinite(duration));

    return {
      totalCalls: calls.length,
      answered: answeredCalls.length,
      missed: missedCalls.length,
      voicemails: null,
      avgDurationSeconds: durations.length
        ? Math.round(durations.reduce((total, duration) => total + duration, 0) / durations.length)
        : null,
    };
  } catch (error) {
    console.error("[Calls] Failed to load Twilio call analytics", error);
    return emptyAnalytics;
  }
}
