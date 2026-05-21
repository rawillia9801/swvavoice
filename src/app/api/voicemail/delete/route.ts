import { NextResponse } from "next/server";
import { hasAppSession } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTwilioRestClient } from "@/lib/twilio/server-client";

const voicemailStatusTable = process.env.SUPABASE_VOICEMAIL_STATUS_TABLE || "voicemail_status";

export async function POST(request: Request) {
  if (!(await hasAppSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = (await request.json()) as {
    recordingSid?: string;
    callSid?: string | null;
    phone?: string | null;
  };

  if (!payload.recordingSid) {
    return NextResponse.json({ error: "Recording SID is required." }, { status: 400 });
  }

  const client = getTwilioRestClient();
  if (!client) {
    return NextResponse.json({ error: "Twilio is not configured." }, { status: 503 });
  }

  try {
    await client.recordings(payload.recordingSid).remove();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Recording could not be deleted." },
      { status: 500 },
    );
  }

  const supabase = getSupabaseServerClient();
  if (supabase) {
    await supabase.from(voicemailStatusTable).upsert(
      {
        recording_sid: payload.recordingSid,
        call_id: payload.callSid || null,
        phone: payload.phone || null,
        deleted: true,
        status: "archived",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "recording_sid" },
    );
  }

  return NextResponse.json({ ok: true });
}
