import { NextResponse } from "next/server";
import { hasAppSession } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const callNotesTable = process.env.SUPABASE_CALL_NOTES_TABLE || "call_notes";
const contactsTable = process.env.SUPABASE_CONTACTS_TABLE || "contacts";

type ContactNoteRow = {
  id: string;
  notes?: string | null;
};

export async function POST(request: Request) {
  if (!(await hasAppSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const payload = (await request.json()) as {
    body?: string;
    callId?: string | null;
    phone?: string | null;
  };

  const body = payload.body?.trim();
  if (!body) {
    return NextResponse.json({ error: "Note body is required." }, { status: 400 });
  }

  const { error } = await supabase.from(callNotesTable).insert({
    body,
    call_id: payload.callId || null,
    phone: payload.phone || null,
  });

  if (error) {
    if (payload.phone && (error.message.includes(callNotesTable) || error.message.includes("schema cache"))) {
      const { data: contacts, error: contactLookupError } = await supabase
        .from(contactsTable)
        .select("id, notes")
        .eq("phone", payload.phone)
        .limit(1);

      if (contactLookupError) {
        return NextResponse.json({ error: contactLookupError.message }, { status: 500 });
      }

      const contact = contacts?.[0] as ContactNoteRow | undefined;
      if (contact) {
        const timestamp = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date());
        const notes = [contact.notes, `${timestamp}: ${body}`].filter(Boolean).join("\n");
        const { error: contactUpdateError } = await supabase
          .from(contactsTable)
          .update({ notes })
          .eq("id", contact.id);

        if (contactUpdateError) {
          return NextResponse.json({ error: contactUpdateError.message }, { status: 500 });
        }

        return NextResponse.json({ ok: true, savedTo: "contact" });
      }
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, savedTo: "call_notes" });
}
