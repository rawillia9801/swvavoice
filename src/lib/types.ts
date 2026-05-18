export type CallerRecord = {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  recognized: boolean;
  leadStatus: string;
  puppyInterest: string;
  nextStep: string;
  notes: string;
};

export type ZohoLeadSnapshot = {
  id: string;
  name: string;
  phone: string;
  email: string;
  leadStatus: string;
  preferredSex: string;
  preferredCoat: string;
  preferredTiming: string;
  nextStep: string;
  lastContacted: string;
};

export type MenuOption = {
  key: string;
  label: string;
  description: string;
  icon: string;
  routeType: "recognized" | "public";
};

export type CallTimelineEvent = {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "lookup" | "crm" | "menu" | "routing";
};

export type RecentCall = {
  id: string;
  name: string;
  phone: string;
  dateLabel: string;
  duration: string;
  status: string;
  recognized: boolean;
};

export type Voicemail = {
  id: string;
  name: string;
  phone: string;
  duration: string;
  dateLabel: string;
  listened: boolean;
};

export type MessageTemplate = {
  id: string;
  name: string;
  preview: string;
  category: string;
};

export type CallNote = {
  id: string;
  author: string;
  timestamp: string;
  body: string;
  followUpDate: string;
};

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  actionType: "sms" | "email" | "zoho-task" | "call-note" | "callback";
};
