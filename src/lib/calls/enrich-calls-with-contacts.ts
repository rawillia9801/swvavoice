import type { CallRecord, LiveCall } from "@/lib/calls/types";
import type { Contact } from "@/lib/contacts/types";
import { phoneMatchKeys } from "@/lib/contacts/normalize-phone";

function buildContactPhoneMap(contacts: Contact[]) {
  const contactByPhone = new Map<string, Contact>();

  for (const contact of contacts) {
    for (const key of phoneMatchKeys(contact.phone)) {
      if (!contactByPhone.has(key)) {
        contactByPhone.set(key, contact);
      }
    }
  }

  return contactByPhone;
}

function findContactForPhone(contactByPhone: Map<string, Contact>, phone: string) {
  for (const key of phoneMatchKeys(phone)) {
    const contact = contactByPhone.get(key);
    if (contact) {
      return contact;
    }
  }

  return null;
}

export function enrichCallRecordsWithContacts(calls: CallRecord[], contacts: Contact[]) {
  const contactByPhone = buildContactPhoneMap(contacts);

  return calls.map((call) => {
    const contact = findContactForPhone(contactByPhone, call.phone);

    if (!contact) {
      return call;
    }

    return {
      ...call,
      callerName: contact.name || call.callerName,
      recognitionStatus: "recognized" as const,
      tags: contact.tags.length > 0 ? contact.tags : call.tags,
      notes: call.notes || contact.notes || null,
    };
  });
}

export function enrichLiveCallWithContacts(liveCall: LiveCall | null, contacts: Contact[]) {
  if (!liveCall) {
    return null;
  }

  const contact = findContactForPhone(buildContactPhoneMap(contacts), liveCall.phone);

  if (!contact) {
    return liveCall;
  }

  return {
    ...liveCall,
    callerName: contact.name || liveCall.callerName,
    recognitionStatus: "recognized" as const,
  };
}
