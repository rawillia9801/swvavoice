import type {
  CallerRecord,
  CallNote,
  CallTimelineEvent,
  MenuOption,
  MessageTemplate,
  QuickAction,
  RecentCall,
  Voicemail,
  ZohoLeadSnapshot,
} from "@/lib/types";

export const activeCaller: CallerRecord | null = null;
export const spokenMessage: string | null = null;
export const zohoLeadSnapshot: ZohoLeadSnapshot | null = null;

export const recognizedCallerMenu: MenuOption[] = [
  {
    key: "1",
    label: "Pickup / Delivery",
    description: "Route to travel, pickup window, or delivery coordination.",
    icon: "truck",
    routeType: "recognized",
  },
  {
    key: "2",
    label: "Balance",
    description: "Answer balance and remaining payment questions.",
    icon: "wallet",
    routeType: "recognized",
  },
  {
    key: "3",
    label: "Puppy Payment Info",
    description: "Share deposit, invoice, and payment instructions.",
    icon: "credit-card",
    routeType: "recognized",
  },
  {
    key: "4",
    label: "Reservation Details",
    description: "Review current reservation details from the CRM record.",
    icon: "bookmark",
    routeType: "recognized",
  },
  {
    key: "5",
    label: "Application Status",
    description: "Confirm where the family is in the application process.",
    icon: "clipboard-check",
    routeType: "recognized",
  },
  {
    key: "6",
    label: "Leave a Message",
    description: "Capture voicemail and attach the follow-up to the record.",
    icon: "voicemail",
    routeType: "recognized",
  },
  {
    key: "0",
    label: "Speak With Someone",
    description: "Route the caller to a staff member when available.",
    icon: "headphones",
    routeType: "recognized",
  },
];

export const publicCallerMenu: MenuOption[] = [
  {
    key: "1",
    label: "Available Puppies",
    description: "General availability and current litter information.",
    icon: "paw-print",
    routeType: "public",
  },
  {
    key: "2",
    label: "Application Link",
    description: "Send the public application link by SMS.",
    icon: "link",
    routeType: "public",
  },
  {
    key: "3",
    label: "Pricing / Payments",
    description: "General pricing, deposits, and payment policies.",
    icon: "receipt",
    routeType: "public",
  },
  {
    key: "4",
    label: "Pickups & Delivery",
    description: "General pickup, meeting point, and delivery information.",
    icon: "map-pin",
    routeType: "public",
  },
  {
    key: "5",
    label: "Leave a Message",
    description: "Record a voicemail for staff review.",
    icon: "voicemail",
    routeType: "public",
  },
  {
    key: "0",
    label: "Speak With Someone",
    description: "Route to a staff member when available.",
    icon: "headphones",
    routeType: "public",
  },
];

export const callTimeline: CallTimelineEvent[] = [];
export const recentCalls: RecentCall[] = [];
export const voicemails: Voicemail[] = [];
export const messageTemplates: MessageTemplate[] = [];
export const callNotes: CallNote[] = [];

export const quickActions: QuickAction[] = [
  {
    id: "action-sms",
    label: "Send SMS",
    icon: "message-square",
    actionType: "sms",
  },
  {
    id: "action-email",
    label: "Send Email",
    icon: "mail",
    actionType: "email",
  },
  {
    id: "action-task",
    label: "Create Zoho Task",
    icon: "list-checks",
    actionType: "zoho-task",
  },
  {
    id: "action-note",
    label: "Add Call Note",
    icon: "file-pen-line",
    actionType: "call-note",
  },
  {
    id: "action-callback",
    label: "Schedule Callback",
    icon: "calendar-clock",
    actionType: "callback",
  },
];
