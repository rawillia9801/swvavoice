import type { CallDirection, CallRecord, CallStatus, LiveCall } from "@/lib/calls/types";

type TwilioCallLike = {
  sid: string;
  from?: string | null;
  to?: string | null;
  direction?: string | null;
  status?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  duration?: string | null;
  callerName?: string | null;
};

export function mapTwilioDirection(direction?: string | null): CallDirection {
  if (!direction) {
    return "unknown";
  }

  if (direction.startsWith("inbound") || direction === "trunking-originating") {
    return "inbound";
  }

  if (direction.startsWith("outbound") || direction === "trunking-terminating") {
    return "outbound";
  }

  return "unknown";
}

export function mapTwilioStatus(status?: string | null): CallStatus {
  if (status === "queued" || status === "ringing" || status === "in-progress") {
    return "active";
  }

  if (status === "completed") {
    return "completed";
  }

  if (status === "busy" || status === "no-answer" || status === "canceled") {
    return "missed";
  }

  if (status === "failed") {
    return "failed";
  }

  return "unknown";
}

function getDisplayPhone(call: TwilioCallLike) {
  const direction = mapTwilioDirection(call.direction);

  if (direction === "outbound") {
    return call.to || call.from || "";
  }

  return call.from || call.to || "";
}

function getDurationSeconds(call: TwilioCallLike) {
  const parsed = Number.parseInt(call.duration || "", 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function mapTwilioCallToRecord(call: TwilioCallLike): CallRecord {
  return {
    id: call.sid,
    callerName: call.callerName || null,
    phone: getDisplayPhone(call),
    recognitionStatus: "unknown",
    direction: mapTwilioDirection(call.direction),
    status: mapTwilioStatus(call.status),
    startedAt: call.startTime?.toISOString() || null,
    endedAt: call.endTime?.toISOString() || null,
    durationSeconds: getDurationSeconds(call),
    agentName: null,
    tags: [],
    notes: null,
    zohoRecordId: null,
    zohoModule: null,
  };
}

export function mapTwilioCallToLiveCall(call: TwilioCallLike): LiveCall {
  return {
    id: call.sid,
    callerName: call.callerName || null,
    phone: getDisplayPhone(call),
    durationSeconds: getDurationSeconds(call),
    recognitionStatus: "unknown",
    zohoRecordId: null,
  };
}
