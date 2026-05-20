import { NextResponse } from "next/server";
import { hasAppSession } from "@/lib/auth";
import type { Contact } from "@/lib/contacts/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const contactsTable = process.env.SUPABASE_CONTACTS_TABLE || "contacts";

function contactToRow(contact: Contact) {
  return {
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    phone_type: contact.phoneType,
    email: contact.email || null,
    contact_group: contact.group,
    tags: contact.tags,
    favorite: contact.favorite,
    location: contact.location || null,
    notes: contact.notes || null,
  };
}

export async function POST(request: Request) {
  if (!(await hasAppSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Supabase is not configured. Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }

  const contact = (await request.json()) as Contact;
  const { error } = await supabase.from(contactsTable).upsert(contactToRow(contact));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
