"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Filter,
  Info,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
  X,
} from "lucide-react";
import { CallControlBar } from "@/components/calls/call-control-bar";
import { CallsTopHeader } from "@/components/calls/calls-top-header";
import { Sidebar } from "@/components/layout/sidebar";
import type {
  Conversation,
  ConversationStatus,
  MessageChannel,
  MessageContact,
  MessageStats,
} from "@/lib/messages/types";

type MessagesWorkspaceProps = {
  initialConversations: Conversation[];
  initialStats: MessageStats;
};

type ComposeModalProps = {
  onClose: () => void;
  onSubmit: (recipient: string, body: string) => void;
};

const tabFilters: Array<"all" | ConversationStatus> = ["all", "unread", "open", "resolved", "archived"];
const fallbackChannels: Array<Exclude<MessageChannel, "unknown">> = ["sms", "whatsapp", "chat", "email"];
const statusOptions: Array<"all" | ConversationStatus> = ["all", "open", "unread", "resolved", "archived"];

function formatChannel(channel: MessageChannel) {
  if (channel === "sms") return "SMS";
  if (channel === "whatsapp") return "WhatsApp";
  if (channel === "chat") return "Chat";
  if (channel === "email") return "Email";
  return "Unknown";
}

function initials(contact?: MessageContact | null) {
  const name = contact?.name?.trim();
  if (!name) return "--";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function displayName(contact?: MessageContact | null) {
  return contact?.name || contact?.phone || contact?.email || "Unknown contact";
}

function formatResponseTime(seconds: number | null) {
  if (seconds == null) return "—";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function contactBadges(contact?: MessageContact | null) {
  return contact?.tags?.filter(Boolean) || [];
}

function ComposeModal({ onClose, onSubmit }: ComposeModalProps) {
  const [recipient, setRecipient] = useState("");
  const [body, setBody] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(recipient, body);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4">
      <form onSubmit={submit} className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">New Message</h2>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-slate-100">
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Recipient</span>
            <input
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-violet-300"
              placeholder="Phone number or email"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Message</span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="mt-2 min-h-32 w-full rounded-md border border-slate-200 p-3 outline-none focus:border-violet-300"
              placeholder="Type your message..."
              required
            />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white">
            Start Message
          </button>
        </div>
      </form>
    </div>
  );
}

export function MessagesWorkspace({ initialConversations, initialStats }: MessagesWorkspaceProps) {
  const [conversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialConversations[0]?.id || "");
  const [globalSearch, setGlobalSearch] = useState("");
  const [conversationSearch, setConversationSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | ConversationStatus>("all");
  const [channelFilter, setChannelFilter] = useState<"all" | MessageChannel>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ConversationStatus>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [composerBody, setComposerBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) || null;
  const selectedContact = selectedConversation?.contact || null;
  const availableChannels = useMemo(() => {
    const fromData = Array.from(new Set(conversations.map((conversation) => conversation.channel).filter((channel) => channel !== "unknown")));
    return fromData.length ? fromData : fallbackChannels;
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    const query = conversationSearch.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const contact = conversation.contact;
      const matchesTab = activeTab === "all" || conversation.status === activeTab;
      const matchesChannel = channelFilter === "all" || conversation.channel === channelFilter;
      const matchesStatus = statusFilter === "all" || conversation.status === statusFilter;
      const searchable = [
        contact?.name,
        contact?.phone,
        contact?.email,
        conversation.lastMessagePreview,
        ...conversation.messages.map((message) => message.body),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesTab && matchesChannel && matchesStatus && (!query || searchable.includes(query));
    });
  }, [activeTab, channelFilter, conversationSearch, conversations, statusFilter]);

  const statsCards = [
    {
      label: "Total Conversations",
      value: initialStats.totalConversations,
      caption: "All messages",
      icon: MessageCircle,
      className: "border-violet-200 bg-violet-50 text-violet-700",
    },
    {
      label: "Open Conversations",
      value: initialStats.openConversations,
      caption: "Awaiting reply",
      icon: MessageSquare,
      className: "border-green-200 bg-green-50 text-green-700",
    },
    {
      label: "Resolved",
      value: initialStats.resolvedConversations,
      caption: "Completed",
      icon: CheckCircle2,
      className: "border-amber-200 bg-amber-50 text-amber-600",
    },
    {
      label: "Avg. Response Time",
      value: formatResponseTime(initialStats.avgResponseTimeSeconds),
      caption: "This month",
      icon: Clock3,
      className: "border-blue-200 bg-blue-50 text-blue-700",
    },
  ];

  const sendMessage = async () => {
    if (!composerBody.trim()) {
      return;
    }

    setSending(true);
    setSendError(null);
    try {
      // TODO: Connect this to the production Twilio/SMS send-message API.
      throw new Error("Message sending is not connected yet.");
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleNewMessage = () => {
    setNotice("New message sending is not connected yet. Connect this to the Twilio/SMS backend before sending.");
    setComposeOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <CallsTopHeader searchValue={globalSearch} onSearchChange={setGlobalSearch} />
          <div className="flex-1 px-7 py-7 pb-6">
            <div className="mx-auto grid max-w-[1440px] gap-6 xl:grid-cols-[1fr_286px]">
              <section className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <p className="mt-2 text-sm text-slate-600">Communicate with customers via SMS and chat.</p>

                <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {statsCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <article key={card.label} className={`rounded-lg border p-5 shadow-sm ${card.className}`}>
                        <div className="flex items-center gap-4">
                          <Icon className="size-8 shrink-0" aria-hidden="true" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">{card.label}</p>
                            <p className="mt-1 text-2xl font-bold text-slate-950">{card.value}</p>
                            <p className="mt-1 text-sm text-slate-600">{card.caption}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap gap-7 border-b border-slate-200">
                  {tabFilters.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`border-b-2 pb-3 text-sm font-semibold capitalize ${
                        activeTab === tab ? "border-violet-600 text-violet-700" : "border-transparent text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <label className="relative min-w-[280px] flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <input
                      value={conversationSearch}
                      onChange={(event) => setConversationSearch(event.target.value)}
                      className="h-11 w-full rounded-md border border-slate-200 bg-white pl-11 pr-4 text-sm shadow-sm outline-none focus:border-violet-300"
                      placeholder="Search conversations..."
                      type="search"
                    />
                  </label>
                  <select value={channelFilter} onChange={(event) => setChannelFilter(event.target.value as "all" | MessageChannel)} className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold shadow-sm">
                    <option value="all">All Channels</option>
                    {availableChannels.map((channel) => <option key={channel} value={channel}>{formatChannel(channel)}</option>)}
                  </select>
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | ConversationStatus)} className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold shadow-sm">
                    {statusOptions.map((status) => <option key={status} value={status}>{status === "all" ? "All Status" : status[0].toUpperCase() + status.slice(1)}</option>)}
                  </select>
                  <button type="button" onClick={() => setFiltersOpen((value) => !value)} className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold shadow-sm">
                    <Filter className="size-4" aria-hidden="true" />
                    Filters
                  </button>
                  <button type="button" onClick={() => setComposeOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-md bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm">
                    <Send className="size-4" aria-hidden="true" />
                    New Message
                  </button>
                </div>

                {filtersOpen ? (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
                    Use the tabs, channel selector, status selector, and search field to filter conversations.
                  </div>
                ) : null}

                <section className="mt-4 grid min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[330px_1fr]">
                  <aside className="border-r border-slate-200">
                    {filteredConversations.length ? (
                      filteredConversations.map((conversation) => (
                        <button
                          key={conversation.id}
                          type="button"
                          onClick={() => setSelectedId(conversation.id)}
                          className={`flex min-h-20 w-full gap-3 border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${
                            selectedId === conversation.id ? "bg-violet-50/50" : ""
                          }`}
                        >
                          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                            {initials(conversation.contact)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="truncate text-sm font-semibold">{displayName(conversation.contact)}</span>
                              <span className="shrink-0 text-xs text-slate-500">{conversation.lastMessageAt || ""}</span>
                            </span>
                            <span className="mt-1 block truncate text-xs text-slate-600">{conversation.lastMessagePreview || "No messages yet"}</span>
                            <span className="mt-2 inline-flex rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                              {formatChannel(conversation.channel)}
                            </span>
                          </span>
                          {conversation.unreadCount > 0 ? (
                            <span className="grid size-5 place-items-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                              {conversation.unreadCount}
                            </span>
                          ) : null}
                        </button>
                      ))
                    ) : (
                      <div className="grid h-full min-h-[420px] place-items-center p-6 text-center">
                        <div>
                          <div className="mx-auto grid size-12 place-items-center rounded-full bg-violet-50 text-violet-700">
                            <MessageCircle className="size-6" aria-hidden="true" />
                          </div>
                          <h3 className="mt-4 text-base font-semibold">No conversations yet</h3>
                          <p className="mt-2 text-sm text-slate-600">Customer messages will appear here.</p>
                        </div>
                      </div>
                    )}
                    <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
                      {filteredConversations.length
                        ? `Showing 1 to ${filteredConversations.length} of ${conversations.length} conversations`
                        : "Showing 0 conversations"}
                    </div>
                  </aside>

                  <section className="flex min-h-[520px] flex-col">
                    {selectedConversation ? (
                      <>
                        <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                          <div className="grid size-10 place-items-center rounded-full bg-violet-100 font-bold text-violet-700">{initials(selectedContact)}</div>
                          <div className="min-w-0">
                            <h2 className="truncate text-base font-semibold">{displayName(selectedContact)}</h2>
                            <p className="text-sm text-slate-600">{selectedContact?.phone || selectedContact?.email || "No contact method loaded"}</p>
                          </div>
                          <span className="ml-2 rounded-full border border-green-200 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">{formatChannel(selectedConversation.channel)}</span>
                          <div className="ml-auto flex gap-2">
                            {[Phone, Video, Info, MoreHorizontal].map((Icon, index) => (
                              <button key={index} type="button" className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50">
                                <Icon className="size-4" aria-hidden="true" />
                              </button>
                            ))}
                          </div>
                        </header>
                        <div className="flex-1 space-y-4 overflow-y-auto bg-white px-5 py-5">
                          {selectedConversation.messages.length ? selectedConversation.messages.map((message) => (
                            <div key={message.id} className={`flex ${message.direction === "outgoing" ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[72%] rounded-xl px-4 py-3 text-sm shadow-sm ${
                                message.direction === "outgoing"
                                  ? "bg-gradient-to-br from-violet-600 to-violet-700 text-white"
                                  : "bg-slate-100 text-slate-950"
                              }`}>
                                <p>{message.body}</p>
                                <p className={`mt-2 text-right text-xs ${message.direction === "outgoing" ? "text-white/75" : "text-slate-500"}`}>{message.sentAt || ""}</p>
                              </div>
                            </div>
                          )) : (
                            <div className="grid h-full min-h-[300px] place-items-center text-center">
                              <div>
                                <MessageSquare className="mx-auto size-10 text-slate-300" aria-hidden="true" />
                                <h3 className="mt-3 font-semibold">No messages in this conversation yet.</h3>
                              </div>
                            </div>
                          )}
                        </div>
                        <footer className="border-t border-slate-200 p-4">
                          {sendError ? <p className="mb-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{sendError}</p> : null}
                          <div className="flex items-center gap-2">
                            <button type="button" className="grid size-10 place-items-center rounded-md border border-slate-200"><Paperclip className="size-4" /></button>
                            <button type="button" className="grid size-10 place-items-center rounded-md border border-slate-200"><Smile className="size-4" /></button>
                            <input
                              value={composerBody}
                              onChange={(event) => setComposerBody(event.target.value)}
                              className="h-10 flex-1 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-violet-300"
                              placeholder="Type your message..."
                            />
                            <button type="button" onClick={sendMessage} disabled={!composerBody.trim() || sending} className="grid size-10 place-items-center rounded-md bg-violet-600 text-white disabled:cursor-not-allowed disabled:opacity-50">
                              <Send className="size-4" />
                            </button>
                          </div>
                        </footer>
                      </>
                    ) : (
                      <div className="grid h-full place-items-center p-6 text-center">
                        <div>
                          <MessageSquare className="mx-auto size-12 text-slate-300" aria-hidden="true" />
                          <h2 className="mt-4 text-lg font-semibold">Select a conversation</h2>
                          <p className="mt-2 text-sm text-slate-600">Choose a conversation from the list to view messages.</p>
                        </div>
                      </div>
                    )}
                  </section>
                </section>
              </section>

              <aside className="space-y-5">
                <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold">Contact Details</h2>
                    <button type="button" disabled={!selectedContact} onClick={() => setNotice("Contact editing is not connected yet.")} className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold disabled:opacity-50">
                      Edit
                    </button>
                  </div>
                  {selectedContact ? (
                    <div className="mt-5">
                      <div className="flex items-center gap-4">
                        <div className="grid size-16 place-items-center rounded-full bg-violet-100 text-xl font-bold text-violet-700">{initials(selectedContact)}</div>
                        <div>
                          <h3 className="text-xl font-bold">{displayName(selectedContact)}</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {contactBadges(selectedContact).map((tag) => <span key={tag} className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">{tag}</span>)}
                          </div>
                        </div>
                      </div>
                      <dl className="mt-5 space-y-4 text-sm">
                        {selectedContact.phone ? <div className="flex gap-3"><Phone className="size-5 text-green-600" /><div><dt>{selectedContact.phone}</dt><dd className="text-slate-500">{selectedContact.phoneType}</dd></div></div> : null}
                        {selectedContact.email ? <div className="flex gap-3"><Mail className="size-5 text-green-600" /><dd>{selectedContact.email}</dd></div> : null}
                        {selectedContact.location ? <div className="flex gap-3"><Info className="size-5 text-green-600" /><dd>{selectedContact.location}</dd></div> : null}
                        {selectedContact.addedAt ? <div className="flex gap-3"><Clock3 className="size-5 text-green-600" /><dd>Added: {selectedContact.addedAt}</dd></div> : null}
                        {selectedConversation?.lastMessageAt ? <div className="flex gap-3"><MessageSquare className="size-5 text-green-600" /><dd>Last message: {selectedConversation.lastMessageAt}</dd></div> : null}
                        {selectedContact.notes ? <div className="flex gap-3"><Menu className="size-5 text-green-600" /><dd>{selectedContact.notes}</dd></div> : null}
                      </dl>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                      <h3 className="font-semibold text-slate-950">No contact selected</h3>
                      <p className="mt-2">Select a conversation to view contact details.</p>
                    </div>
                  )}
                </section>
                <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-base font-semibold">Quick Actions</h2>
                  <div className="mt-4 space-y-2">
                    {[
                      { label: "Call Contact", icon: Phone, color: "text-green-700" },
                      { label: "Send Message", icon: MessageSquare, color: "text-blue-700" },
                      { label: "Send Email", icon: Mail, color: "text-violet-700" },
                      { label: "Add Note", icon: Menu, color: "text-amber-700" },
                    ].map(({ label, icon: Icon, color }) => (
                      <button
                        key={label}
                        type="button"
                        disabled={!selectedContact}
                        onClick={() => setNotice(`${label} is not connected yet.`)}
                        className="flex h-10 w-full items-center gap-3 rounded-md border border-slate-200 px-3 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Icon className={`size-4 ${color}`} aria-hidden="true" />
                        {label}
                      </button>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>
          <CallControlBar />
        </div>
      </div>
      {composeOpen ? <ComposeModal onClose={() => setComposeOpen(false)} onSubmit={handleNewMessage} /> : null}
      {notice ? (
        <div className="fixed bottom-24 right-6 z-50 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 shadow-lg">
          {notice}
          <button type="button" onClick={() => setNotice(null)} className="ml-4 font-bold">Close</button>
        </div>
      ) : null}
    </main>
  );
}
