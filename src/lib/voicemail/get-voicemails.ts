import type { Contact } from "@/lib/contacts/types";
import { getContacts } from "@/lib/contacts/get-contacts";
import { phoneMatchKeys } from "@/lib/contacts/normalize-phone";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTwilioRestClient } from "@/lib/twilio/server-client";
import type {
  VoicemailMailboxSummary,
  VoicemailRecord,
  VoicemailStats,
  VoicemailStatus,
} from "@/lib/voicemail/types";

type TwilioRecordingLike = {
  sid: string;
  callSid?: string | null;
  dateCreated?: Date | string | null;
  duration?: string | null;
  status?: string | null;
};

type TwilioCallLike = {
  sid: string;
  from?: string | null;
  to?: string | null;
  direction?: string | null;
  status?: string | null;
};

type VoicemailStatusRow = {
  recording_sid?: string | null;
  status?: string | null;
  transcript?: string | null;
  transcript_confidence?: number | null;
  mailbox?: string | null;
  archived?: boolean | null;
  deleted?: boolean | null;
  updated_at?: string | null;
};

type CallNoteRow = {
  body?: string | null;
  call_id?: string | null;
  phone?: string | null;
};

const voicemailStatusTable = process.env.SUPABASE_VOICEMAIL_STATUS_TABLE || "voicemail_status";
const callNotesTable = process.env.SUPABASE_CALL_NOTES_TABLE || "call_notes";

function normalizeStatus(value?: string | null): VoicemailStatus {
  if (
    value === "new" ||
    value === "unheard" ||
    value === "heard" ||
    value === "callback" ||
    value === "follow-up" ||
    value === "archived" ||
    value === "failed"
  ) {
    return value;
  }

  return "unheard";
}

function getCallPhone(call?: TwilioCallLike | null) {
  if (!call) {
    return "";
  }

  const direction = call.direction || "";

  if (direction.startsWith("outbound")) {
    return call.to || call.from || "";
  }

  return call.from || call.to || "";
}

function findContact(contacts: Contact[], phone: string) {
  const callKeys = phoneMatchKeys(phone);

  return contacts.find((contact) => {
    for (const key of phoneMatchKeys(contact.phone)) {
      if (callKeys.has(key)) {
        return true;
      }
    }

    return false;
  }) || null;
}

function durationSeconds(value?: string | null) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) ? parsed : null;
}

async function getStatusRows(recordingSids: string[]) {
  const supabase = getSupabaseServerClient();

  if (!supabase || recordingSids.length === 0) {
    return new Map<string, VoicemailStatusRow>();
  }

  try {
    const { data, error } = await supabase
      .from(voicemailStatusTable)
      .select("recording_sid, status, transcript, transcript_confidence, mailbox, archived, deleted, updated_at")
      .in("recording_sid", recordingSids);

    if (error || !data) {
      return new Map<string, VoicemailStatusRow>();
    }

    return new Map(
      data.map((row) => {
        const typedRow = row as VoicemailStatusRow;
        return [typedRow.recording_sid || "", typedRow] as const;
      }),
    );
  } catch {
    return new Map<string, VoicemailStatusRow>();
  }
}

async function getNoteRows(callSids: string[], phones: string[]) {
  const supabase = getSupabaseServerClient();

  if (!supabase || (callSids.length === 0 && phones.length === 0)) {
    return [];
  }

  const filters = [
    ...callSids.map((sid) => `call_id.eq.${sid}`),
    ...phones.map((phone) => `phone.eq.${phone}`),
  ];

  try {
    const { data, error } = await supabase
      .from(callNotesTable)
      .select("body, call_id, phone")
      .or(filters.join(","))
      .limit(100);

    if (error || !data) {
      return [];
    }

    return data as CallNoteRow[];
  } catch {
    return [];
  }
}

function notesForVoicemail(notes: CallNoteRow[], callSid: string | null, phone: string) {
  return notes
    .filter((note) => (callSid && note.call_id === callSid) || (phone && note.phone === phone))
    .map((note) => note.body || "")
    .filter(Boolean);
}

export function getVoicemailStats(voicemails: VoicemailRecord[]): VoicemailStats {
  const visible = voicemails.filter((voicemail) => !voicemail.deleted && !voicemail.archived);
  const durations = visible
    .map((voicemail) => voicemail.durationSeconds)
    .filter((duration): duration is number => typeof duration === "number" && Number.isFinite(duration));

  return {
    total: visible.length,
    newOrUnheard: visible.filter((voicemail) => voicemail.status === "new" || voicemail.status === "unheard").length,
    callbacksNeeded: visible.filter((voicemail) => voicemail.status === "callback" || voicemail.status === "follow-up").length,
    avgMessageLengthSeconds: durations.length
      ? Math.round(durations.reduce((total, duration) => total + duration, 0) / durations.length)
      : null,
  };
}

export function getMailboxSummary(voicemails: VoicemailRecord[]): VoicemailMailboxSummary {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return {
    activeGreeting: null,
    mailboxHealth: voicemails.length > 0 ? "healthy" : "unknown",
    currentMonthCount: voicemails.filter((voicemail) => {
      if (!voicemail.receivedAt) {
        return false;
      }

      return new Date(voicemail.receivedAt) >= startOfMonth;
    }).length,
  };
}

export async function getVoicemails(limit = 25): Promise<VoicemailRecord[]> {
  const client = getTwilioRestClient();

  if (!client) {
    return [];
  }

  try {
    const recordings = (await client.recordings.list({
      limit,
      pageSize: Math.min(limit, 50),
    })) as TwilioRecordingLike[];
    const contacts = await getContacts();
    const statusByRecordingSid = await getStatusRows(recordings.map((recording) => recording.sid));
    const calls = await Promise.all(
      recordings.map(async (recording) => {
        if (!recording.callSid) {
          return null;
        }

        try {
          return (await client.calls(recording.callSid).fetch()) as TwilioCallLike;
        } catch {
          return null;
        }
      }),
    );
    const phones = calls.map((call) => getCallPhone(call)).filter(Boolean);
    const callSids = recordings.map((recording) => recording.callSid || "").filter(Boolean);
    const notes = await getNoteRows(callSids, phones);

    return recordings
      .map((recording, index): VoicemailRecord => {
        const call = calls[index];
        const phone = getCallPhone(call);
        const contact = findContact(contacts, phone);
        const statusRow = statusByRecordingSid.get(recording.sid);
        const archived = Boolean(statusRow?.archived) || normalizeStatus(statusRow?.status) === "archived";
        const deleted = Boolean(statusRow?.deleted);

        return {
          id: recording.sid,
          recordingSid: recording.sid,
          callSid: recording.callSid || null,
          callerName: contact?.name || null,
          phone,
          mailbox: statusRow?.mailbox || null,
          status: archived ? "archived" : normalizeStatus(statusRow?.status),
          receivedAt: recording.dateCreated ? new Date(recording.dateCreated).toISOString() : null,
          durationSeconds: durationSeconds(recording.duration),
          recordingAvailable: recording.status === "completed" || recording.status == null,
          audioUrl: `/api/voicemail/audio?recordingSid=${encodeURIComponent(recording.sid)}`,
          transcript: statusRow?.transcript || null,
          transcriptConfidence: statusRow?.transcript_confidence ?? null,
          notes: notesForVoicemail(notes, recording.callSid || null, phone),
          contact,
          archived,
          deleted,
        };
      })
      .filter((voicemail) => !voicemail.deleted);
  } catch (error) {
    console.error("[Voicemail] Failed to load Twilio recordings", error);
    return [];
  }
}
