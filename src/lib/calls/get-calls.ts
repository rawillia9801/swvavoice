import type { CallRecord } from "@/lib/calls/types";
import { mapTwilioCallToRecord } from "@/lib/calls/twilio-call-mapper";
import { getTwilioRestClient } from "@/lib/twilio/server-client";

export async function getCalls(): Promise<CallRecord[]> {
  const client = getTwilioRestClient();

  if (!client) {
    return [];
  }

  try {
    const calls = await client.calls.list({
      limit: 50,
      pageSize: 50,
    });

    return calls.map(mapTwilioCallToRecord);
  } catch (error) {
    console.error("[Calls] Failed to load Twilio calls", error);
    return [];
  }
}
