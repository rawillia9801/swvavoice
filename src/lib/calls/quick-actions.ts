import type { CallsQuickAction } from "@/lib/calls/types";

export const callsQuickActions: CallsQuickAction[] = [
  {
    id: "send-sms",
    label: "Send SMS",
    actionType: "send_sms",
    enabled: false,
  },
  {
    id: "send-email",
    label: "Send Email",
    actionType: "send_email",
    enabled: false,
  },
  {
    id: "create-zoho-task",
    label: "Create Zoho Task",
    actionType: "create_zoho_task",
    enabled: false,
  },
  {
    id: "add-call-note",
    label: "Add Call Note",
    actionType: "add_call_note",
    enabled: false,
  },
  {
    id: "schedule-callback",
    label: "Schedule Callback",
    actionType: "schedule_callback",
    enabled: false,
  },
];
