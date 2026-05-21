import type { CallNote } from "@/lib/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type CallNoteRow = {
  id?: string | null;
  body?: string | null;
  call_id?: string | null;
  phone?: string | null;
  created_at?: string | null;
};

const callNotesTable = process.env.SUPABASE_CALL_NOTES_TABLE || "call_notes";

function mapCallNote(row: CallNoteRow): CallNote {
  const createdAt = row.created_at ? new Date(row.created_at) : new Date();

  return {
    id: row.id || crypto.randomUUID(),
    author: "System",
    timestamp: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(createdAt),
    body: row.body || "",
    followUpDate: "No follow-up scheduled",
  };
}

export async function getCallNotes(params: {
  callId?: string | null;
  phone?: string | null;
}): Promise<CallNote[]> {
  const supabase = getSupabaseServerClient();

  if (!supabase || (!params.callId && !params.phone)) {
    return [];
  }

  try {
    let query = supabase
      .from(callNotesTable)
      .select("id, body, call_id, phone, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (params.callId && params.phone) {
      query = query.or(`call_id.eq.${params.callId},phone.eq.${params.phone}`);
    } else if (params.callId) {
      query = query.eq("call_id", params.callId);
    } else if (params.phone) {
      query = query.eq("phone", params.phone);
    }

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    return data.map((row) => mapCallNote(row as CallNoteRow));
  } catch {
    return [];
  }
}
