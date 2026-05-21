import type { LiveCall } from "@/lib/calls/types";
import { enrichLiveCallWithContacts } from "@/lib/calls/enrich-calls-with-contacts";
import { mapTwilioCallToLiveCall } from "@/lib/calls/twilio-call-mapper";
import { getContacts } from "@/lib/contacts/get-contacts";
import { getTwilioRestClient } from "@/lib/twilio/server-client";

export async function getLiveCall(): Promise<LiveCall | null> {
  const client = getTwilioRestClient();

  if (!client) {
    return null;
  }

  try {
    const activeStatuses = ["in-progress", "ringing", "queued"] as const;

    for (const status of activeStatuses) {
      const calls = await client.calls.list({
        status,
        limit: 1,
        pageSize: 1,
      });

      if (calls[0]) {
        const contacts = await getContacts();

        return enrichLiveCallWithContacts(mapTwilioCallToLiveCall(calls[0]), contacts);
      }
    }

    return null;
  } catch (error) {
    console.error("[Calls] Failed to load live Twilio call", error);
    return null;
  }
}
