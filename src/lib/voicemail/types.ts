import type { Contact } from "@/lib/contacts/types";

export type VoicemailStatus =
  | "new"
  | "unheard"
  | "heard"
  | "callback"
  | "follow-up"
  | "archived"
  | "failed";

export type VoicemailRecord = {
  id: string;
  recordingSid: string;
  callSid: string | null;
  callerName: string | null;
  phone: string;
  mailbox: string | null;
  status: VoicemailStatus;
  receivedAt: string | null;
  durationSeconds: number | null;
  recordingAvailable: boolean;
  audioUrl: string | null;
  transcript: string | null;
  transcriptConfidence: number | null;
  notes: string[];
  contact: Contact | null;
  archived: boolean;
  deleted: boolean;
};

export type VoicemailStats = {
  total: number;
  newOrUnheard: number;
  callbacksNeeded: number;
  avgMessageLengthSeconds: number | null;
};

export type VoicemailMailboxSummary = {
  activeGreeting: string | null;
  mailboxHealth: "healthy" | "not_configured" | "unknown";
  currentMonthCount: number;
};
