export type CallDirection = "inbound" | "outbound" | "unknown";

export type CallStatus =
  | "active"
  | "completed"
  | "voicemail"
  | "missed"
  | "failed"
  | "unknown";

export type CallerRecognitionStatus = "recognized" | "new" | "no_match" | "unknown";

export type CallRecord = {
  id: string;
  callerName?: string | null;
  phone: string;
  recognitionStatus: CallerRecognitionStatus;
  direction: CallDirection;
  status: CallStatus;
  startedAt?: string | null;
  endedAt?: string | null;
  durationSeconds?: number | null;
  agentName?: string | null;
  tags?: string[];
  notes?: string | null;
  zohoRecordId?: string | null;
  zohoModule?: "Leads" | "Contacts" | "Deals" | null;
};

export type CallMetric = {
  id: string;
  label: string;
  value: string | number | null;
  helperText?: string | null;
  loading?: boolean;
};

export type LiveCall = {
  id: string;
  callerName?: string | null;
  phone: string;
  location?: string | null;
  durationSeconds?: number | null;
  recognitionStatus: CallerRecognitionStatus;
  zohoRecordId?: string | null;
};

export type CallAnalytics = {
  totalCalls: number | null;
  answered: number | null;
  missed: number | null;
  voicemails: number | null;
  avgDurationSeconds: number | null;
};

export type CallsQuickAction = {
  id: string;
  label: string;
  actionType:
    | "send_sms"
    | "send_email"
    | "create_zoho_task"
    | "add_call_note"
    | "schedule_callback";
  enabled: boolean;
};

export type VoiceConnectionStatus = "uninitialized" | "loading" | "ready" | "offline" | "error";

export type CallState = "idle" | "dialing" | "ringing" | "active" | "muted" | "ended" | "failed";

export type CallsTab = "All Calls" | "Inbound" | "Outbound" | "Missed" | "Voicemails";
