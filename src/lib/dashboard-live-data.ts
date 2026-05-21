import { formatCallDuration } from "@/lib/calls/format-call-duration";
import type { CallRecord, LiveCall } from "@/lib/calls/types";
import { phoneMatchKeys } from "@/lib/contacts/normalize-phone";
import type { Contact } from "@/lib/contacts/types";
import type { CallerRecord, CallTimelineEvent, RecentCall, ZohoLeadSnapshot } from "@/lib/types";

function formatDateLabel(value?: string | null) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTime(value?: string | null) {
  if (!value) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function findContactForPhone(contacts: Contact[], phone: string) {
  const callKeys = phoneMatchKeys(phone);

  return contacts.find((contact) => {
    for (const key of phoneMatchKeys(contact.phone)) {
      if (callKeys.has(key)) {
        return true;
      }
    }

    return false;
  });
}

export function getDashboardActiveCall(
  liveCall: LiveCall | null,
  calls: CallRecord[],
): CallRecord | LiveCall | null {
  if (liveCall) {
    return liveCall;
  }

  return calls.find((call) => call.status === "active") || null;
}

export function mapActiveCallToCaller(
  activeCall: CallRecord | LiveCall | null,
  contacts: Contact[],
): CallerRecord | null {
  if (!activeCall) {
    return null;
  }

  const contact = findContactForPhone(contacts, activeCall.phone);
  const name = activeCall.callerName || contact?.name || "Unknown caller";

  return {
    id: activeCall.id,
    name,
    phone: activeCall.phone,
    email: contact?.email || "",
    location: contact?.location || "No live location",
    recognized: Boolean(contact) || activeCall.recognitionStatus === "recognized",
    leadStatus: contact?.group || "No live data",
    puppyInterest: contact?.tags.join(", ") || "No live data",
    nextStep: "No live data",
    notes: contact?.notes || "No live data",
  };
}

export function mapActiveCallToSnapshot(
  activeCall: CallRecord | LiveCall | null,
  contacts: Contact[],
): ZohoLeadSnapshot | null {
  if (!activeCall) {
    return null;
  }

  const contact = findContactForPhone(contacts, activeCall.phone);
  if (!contact) {
    return null;
  }

  return {
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    email: contact.email || "No live data",
    leadStatus: contact.group,
    preferredSex: "No live data",
    preferredCoat: "No live data",
    preferredTiming: "No live data",
    nextStep: "No live data",
    lastContacted: contact.lastInteraction || formatDateLabel("startedAt" in activeCall ? activeCall.startedAt : null),
  };
}

export function mapCallsToRecentCalls(calls: CallRecord[]): RecentCall[] {
  return calls.slice(0, 4).map((call) => ({
    id: call.id,
    name: call.callerName || "Unknown caller",
    phone: call.phone || "No phone number",
    dateLabel: call.status === "active" ? "Active Call" : formatDateLabel(call.startedAt),
    duration: formatCallDuration(call.durationSeconds),
    status: call.status === "active" ? "Active" : call.status,
    recognized: call.recognitionStatus === "recognized",
  }));
}

export function mapActiveCallToTimeline(
  activeCall: CallRecord | LiveCall | null,
  contacts: Contact[],
): CallTimelineEvent[] {
  if (!activeCall) {
    return [];
  }

  const contact = findContactForPhone(contacts, activeCall.phone);
  const time = formatTime("startedAt" in activeCall ? activeCall.startedAt : null);
  const events: CallTimelineEvent[] = [
    {
      id: `${activeCall.id}-live`,
      time,
      title: "Active call detected",
      description: `Twilio reports an active call for ${activeCall.phone || "unknown phone"}.`,
      type: "lookup",
    },
  ];

  if (contact) {
    events.push({
      id: `${activeCall.id}-contact`,
      time,
      title: "Contact matched",
      description: `Supabase contact: ${contact.name}`,
      type: "crm",
    });
  }

  events.push({
    id: `${activeCall.id}-menu`,
    time,
    title: contact ? "Recognized caller menu available" : "Public caller menu available",
    description: contact ? "Serving recognized caller options." : "No contact match found yet.",
    type: "menu",
  });

  return events;
}
