import { NextResponse } from "next/server";
import { hasAppSession } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { VoicemailStatus } from "@/lib/voicemail/types";

const voicemailStatusTable = process.env.SUPABASE_VOICEMAIL_STATUS_TABLE || "voicemail_status";

function isVoicemailStatus(value: unknown): value is VoicemailStatus {
  return (
    value === "new" ||
    value === "unheard" ||
    value === "heard" ||
    value === "callback" ||
    value === "follow-up" ||
    value === "archived" ||
    value === "failed"
  );
}

export async function POST(request: Request) {
  if (!(await hasAppSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const payload = (await request.json()) as {
    recordingSid?: string;
    callSid?: string | null;
    phone?: string | null;
    status?: unknown;
    archived?: boolean;
    deleted?: boolean;
  };

  if (!payload.recordingSid) {
    return NextResponse.json({ error: "Recording SID is required." }, { status: 400 });
  }

  if (payload.status != null && !isVoicemailStatus(payload.status)) {
    return NextResponse.json({ error: "Invalid voicemail status." }, { status: 400 });
  }

  const row = {
    recording_sid: payload.recordingSid,
    call_id: payload.callSid || null,
    phone: payload.phone || null,
    ...(payload.status ? { status: payload.status } : {}),
    ...(payload.archived != null ? { archived: payload.archived } : {}),
    ...(payload.deleted != null ? { deleted: payload.deleted } : {}),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from(voicemailStatusTable)
    .upsert(row, { onConflict: "recording_sid" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
