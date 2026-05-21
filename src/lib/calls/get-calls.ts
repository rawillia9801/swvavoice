import type { CallRecord } from "@/lib/calls/types";
import { enrichCallRecordsWithContacts } from "@/lib/calls/enrich-calls-with-contacts";
import { mapTwilioCallToRecord } from "@/lib/calls/twilio-call-mapper";
import { getContacts } from "@/lib/contacts/get-contacts";
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

    const contacts = await getContacts();

    return enrichCallRecordsWithContacts(calls.map(mapTwilioCallToRecord), contacts);
  } catch (error) {
    console.error("[Calls] Failed to load Twilio calls", error);
    return [];
  }
}
