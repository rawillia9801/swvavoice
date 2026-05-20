export type MessageChannel = "sms" | "whatsapp" | "chat" | "email" | "unknown";

export type ConversationStatus = "open" | "unread" | "resolved" | "archived";

export type MessageDirection = "incoming" | "outgoing";

export type MessageAttachment = {
  id: string;
  url: string;
  alt?: string | null;
};

export type MessageContact = {
  id: string;
  name?: string | null;
  phone?: string | null;
  phoneType?: string | null;
  email?: string | null;
  location?: string | null;
  addedAt?: string | null;
  notes?: string | null;
  tags?: string[];
};

export type ConversationMessage = {
  id: string;
  body: string;
  direction: MessageDirection;
  sentAt?: string | null;
  read?: boolean;
  attachments?: MessageAttachment[];
};

export type Conversation = {
  id: string;
  contact?: MessageContact | null;
  channel: MessageChannel;
  status: ConversationStatus;
  unreadCount: number;
  lastMessagePreview?: string | null;
  lastMessageAt?: string | null;
  messages: ConversationMessage[];
};

export type MessageStats = {
  totalConversations: number;
  openConversations: number;
  resolvedConversations: number;
  avgResponseTimeSeconds: number | null;
};
