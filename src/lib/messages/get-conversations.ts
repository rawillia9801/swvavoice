import type { Conversation, MessageStats } from "@/lib/messages/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ConversationRow = Record<string, unknown>;
type MessageRow = Record<string, unknown>;

const conversationsTable = process.env.SUPABASE_CONVERSATIONS_TABLE || "conversations";
const messagesTable = process.env.SUPABASE_MESSAGES_TABLE || "conversation_messages";

function readString(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
}

function readStringArray(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string");
    }
  }

  return [];
}

function normalizeChannel(value: string): Conversation["channel"] {
  if (value === "sms" || value === "whatsapp" || value === "chat" || value === "email") {
    return value;
  }

  return "unknown";
}

function normalizeStatus(value: string): Conversation["status"] {
  if (value === "unread" || value === "resolved" || value === "archived") {
    return value;
  }

  return "open";
}

export async function getConversations(): Promise<Conversation[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data: conversations, error } = await supabase
    .from(conversationsTable)
    .select("*")
    .order("last_message_at", { ascending: false });

  if (error || !conversations?.length) {
    return [];
  }

  const conversationIds = conversations
    .map((conversation) => readString(conversation as ConversationRow, ["id"]))
    .filter(Boolean);

  const { data: messages } = await supabase
    .from(messagesTable)
    .select("*")
    .in("conversation_id", conversationIds)
    .order("sent_at", { ascending: true });

  const messagesByConversation = new Map<string, MessageRow[]>();
  for (const message of messages || []) {
    const row = message as MessageRow;
    const conversationId = readString(row, ["conversation_id"]);
    messagesByConversation.set(conversationId, [...(messagesByConversation.get(conversationId) || []), row]);
  }

  return conversations.map((conversation) => {
    const row = conversation as ConversationRow;
    const id = readString(row, ["id"]);
    const conversationMessages = messagesByConversation.get(id) || [];

    return {
      id,
      channel: normalizeChannel(readString(row, ["channel"])),
      status: normalizeStatus(readString(row, ["status"])),
      unreadCount: Number(row.unread_count || 0),
      lastMessagePreview: readString(row, ["last_message_preview"]),
      lastMessageAt: readString(row, ["last_message_at"]),
      contact: {
        id: readString(row, ["contact_id"]) || id,
        name: readString(row, ["contact_name", "name"]),
        phone: readString(row, ["contact_phone", "phone"]),
        phoneType: readString(row, ["contact_phone_type", "phone_type"]),
        email: readString(row, ["contact_email", "email"]),
        location: readString(row, ["contact_location", "location"]),
        addedAt: readString(row, ["contact_added_at", "added_at"]),
        notes: readString(row, ["contact_notes", "notes"]),
        tags: readStringArray(row, ["contact_tags", "tags"]),
      },
      messages: conversationMessages.map((message) => ({
        id: readString(message, ["id"]),
        body: readString(message, ["body"]),
        direction: readString(message, ["direction"]) as "incoming" | "outgoing",
        sentAt: readString(message, ["sent_at"]),
        read: Boolean(message.read),
        attachments: [],
      })),
    };
  });
}

export function getMessageStats(conversations: Conversation[]): MessageStats {
  return {
    totalConversations: conversations.length,
    openConversations: conversations.filter((conversation) =>
      conversation.status === "open" || conversation.status === "unread",
    ).length,
    resolvedConversations: conversations.filter((conversation) => conversation.status === "resolved").length,
    avgResponseTimeSeconds: null,
  };
}
