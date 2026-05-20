import type { Contact, ContactGroup } from "@/lib/contacts/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ContactRow = Record<string, unknown>;

const contactsTable = process.env.SUPABASE_CONTACTS_TABLE || "contacts";

function readString(row: ContactRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
}

function readStringArray(row: ContactRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string");
    }
    if (typeof value === "string" && value.trim()) {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }

  return [];
}

function normalizeGroup(value: string): ContactGroup {
  if (value === "Lead" || value === "Supplier") {
    return value;
  }

  return "Customer";
}

export function mapContactRow(row: ContactRow): Contact {
  const createdAt = readString(row, ["created_at", "added", "added_at"]);
  const updatedAt = readString(row, ["updated_at", "last_interaction", "lastInteraction"]);

  return {
    id: readString(row, ["id"]) || crypto.randomUUID(),
    name: readString(row, ["name", "full_name", "display_name"]),
    phone: readString(row, ["phone", "phone_number", "mobile"]),
    phoneType: readString(row, ["phone_type"]) || "Mobile",
    email: readString(row, ["email"]),
    group: normalizeGroup(readString(row, ["group", "contact_group", "type"])),
    tags: readStringArray(row, ["tags"]),
    added: createdAt ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(createdAt)) : "",
    favorite: Boolean(row.favorite),
    location: readString(row, ["location", "city"]),
    lastInteraction: updatedAt ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(updatedAt)) : "",
    notes: readString(row, ["notes", "note"]),
  };
}

export async function getContacts(): Promise<Contact[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from(contactsTable)
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => mapContactRow(row as ContactRow));
}
