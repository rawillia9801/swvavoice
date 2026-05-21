"use client";

import { useMemo, useRef, useState } from "react";
import {
  AudioLines,
  CalendarClock,
  Clock3,
  FileText,
  Mail,
  Mic2,
  Pause,
  Phone,
  Play,
  RotateCcw,
  Search,
  Send,
  Volume2,
  VolumeX,
  Voicemail,
  type LucideIcon,
} from "lucide-react";
import { CallControlBar } from "@/components/calls/call-control-bar";
import { CallsTopHeader } from "@/components/calls/calls-top-header";
import { Sidebar } from "@/components/layout/sidebar";
import { formatCallDuration } from "@/lib/calls/format-call-duration";
import type { VoicemailMailboxSummary, VoicemailRecord, VoicemailStats, VoicemailStatus } from "@/lib/voicemail/types";

type VoicemailWorkspaceProps = {
  initialVoicemails: VoicemailRecord[];
  stats: VoicemailStats;
  mailbox: VoicemailMailboxSummary;
};

const tabs = ["All", "New", "Unheard", "Follow-up", "Archived"] as const;
const statusOptions = ["All Status", "New", "Unheard", "Heard", "Callback", "Follow-up", "Archived", "Failed"];

type StatCardConfig = {
  label: string;
  value: string | number;
  caption: string;
  icon: LucideIcon;
  className: string;
};

function initials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "VM";
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusLabel(status: VoicemailStatus) {
  return status
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function statusClass(status: VoicemailStatus) {
  if (status === "new" || status === "unheard") {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }
  if (status === "heard") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  if (status === "callback" || status === "follow-up") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (status === "archived") {
    return "border-slate-200 bg-slate-100 text-slate-700";
  }
  return "border-red-200 bg-red-50 text-red-700";
}

export function VoicemailWorkspace({ initialVoicemails, stats, mailbox }: VoicemailWorkspaceProps) {
  const [voicemails, setVoicemails] = useState(initialVoicemails);
  const [selectedId, setSelectedId] = useState(initialVoicemails[0]?.id || "");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [mailboxFilter, setMailboxFilter] = useState("All Mailboxes");
  const [message, setMessage] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const mailboxOptions = useMemo(
    () => ["All Mailboxes", ...Array.from(new Set(voicemails.map((voicemail) => voicemail.mailbox).filter(Boolean)))],
    [voicemails],
  );
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return voicemails.filter((voicemail) => {
      const matchesSearch =
        !query ||
        voicemail.callerName?.toLowerCase().includes(query) ||
        voicemail.phone.toLowerCase().includes(query) ||
        voicemail.transcript?.toLowerCase().includes(query) ||
        voicemail.notes.join(" ").toLowerCase().includes(query) ||
        voicemail.contact?.email.toLowerCase().includes(query) ||
        voicemail.contact?.tags.join(" ").toLowerCase().includes(query);
      const matchesTab =
        activeTab === "All" ||
        (activeTab === "New" && voicemail.status === "new") ||
        (activeTab === "Unheard" && voicemail.status === "unheard") ||
        (activeTab === "Follow-up" && (voicemail.status === "follow-up" || voicemail.status === "callback")) ||
        (activeTab === "Archived" && voicemail.status === "archived");
      const matchesMailbox = mailboxFilter === "All Mailboxes" || voicemail.mailbox === mailboxFilter;
      const matchesStatus =
        statusFilter === "All Status" || statusLabel(voicemail.status) === statusFilter;

      return matchesSearch && matchesTab && matchesMailbox && matchesStatus;
    });
  }, [activeTab, mailboxFilter, search, statusFilter, voicemails]);
  const selected = voicemails.find((voicemail) => voicemail.id === selectedId) || filtered[0] || null;
  const progress = selected?.durationSeconds ? Math.min(100, (currentTime / selected.durationSeconds) * 100) : 0;
  const statCards: StatCardConfig[] = [
    {
      label: "Total Voicemails",
      value: stats.total,
      caption: "All time",
      icon: Voicemail,
      className: "border-violet-200 bg-violet-50 text-violet-700",
    },
    {
      label: "New / Unheard",
      value: stats.newOrUnheard,
      caption: "Require attention",
      icon: AudioLines,
      className: "border-green-200 bg-green-50 text-green-700",
    },
    {
      label: "Callbacks Needed",
      value: stats.callbacksNeeded,
      caption: "Awaiting callback",
      icon: Phone,
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    {
      label: "Avg. Message Length",
      value: formatCallDuration(stats.avgMessageLengthSeconds),
      caption: "This month",
      icon: Clock3,
      className: "border-blue-200 bg-blue-50 text-blue-700",
    },
  ];

  const updateVoicemailStatus = async (voicemail: VoicemailRecord, patch: Partial<VoicemailRecord> & { status?: VoicemailStatus }) => {
    const response = await fetch("/api/voicemail/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recordingSid: voicemail.recordingSid,
        callSid: voicemail.callSid,
        phone: voicemail.phone,
        status: patch.status,
        archived: patch.archived,
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setMessage(payload.error || "Voicemail status could not be updated.");
      return;
    }

    setVoicemails((current) =>
      current.map((item) => item.id === voicemail.id ? { ...item, ...patch } : item),
    );
  };

  const addNote = async () => {
    if (!selected) {
      return;
    }

    const body = window.prompt("Add internal voicemail note");
    if (!body?.trim()) {
      return;
    }

    const response = await fetch("/api/call-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, callId: selected.callSid, phone: selected.phone }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setMessage(payload.error || "Note could not be saved.");
      return;
    }

    setVoicemails((current) =>
      current.map((item) => item.id === selected.id ? { ...item, notes: [body, ...item.notes] } : item),
    );
    setMessage("Note saved to Supabase.");
  };

  const deleteVoicemail = async () => {
    if (!selected || !window.confirm("Delete this voicemail recording from Twilio? This cannot be undone.")) {
      return;
    }

    const response = await fetch("/api/voicemail/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recordingSid: selected.recordingSid,
        callSid: selected.callSid,
        phone: selected.phone,
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setMessage(payload.error || "Voicemail could not be deleted.");
      return;
    }

    setVoicemails((current) => current.filter((item) => item.id !== selected.id));
    setSelectedId("");
  };

  const playPause = async () => {
    if (!selected?.recordingAvailable || !audioRef.current) {
      return;
    }

    if (playing) {
      audioRef.current.pause();
      return;
    }

    await audioRef.current.play();
  };

  const setRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <CallsTopHeader searchValue={search} onSearchChange={setSearch} />
          <div className="flex-1 px-7 py-7 pb-28">
            <div className="mx-auto max-w-[1390px]">
              <h1 className="text-3xl font-bold tracking-tight">Voicemail</h1>
              <p className="mt-2 text-sm text-slate-600">Review, manage, and return customer voicemail messages.</p>

              <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map(({ label, value, caption, icon: Icon, className }) => (
                  <section key={label} className={`rounded-lg border p-5 shadow-sm ${className}`}>
                    <div className="flex items-center gap-4">
                      <Icon className="size-8" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{label}</p>
                        <p className="text-2xl font-bold text-slate-950">{value}</p>
                        <p className="text-xs text-slate-600">{caption}</p>
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-7 flex gap-7 border-b border-slate-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`border-b-2 pb-3 text-sm font-semibold ${activeTab === tab ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_180px_180px_180px_180px]">
                <label className="relative">
                  <span className="sr-only">Search voicemails</span>
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm shadow-sm"
                    placeholder="Search voicemails..."
                    type="search"
                  />
                </label>
                <select value={mailboxFilter} onChange={(event) => setMailboxFilter(event.target.value)} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm">
                  {mailboxOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                <button type="button" disabled className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-500 shadow-sm disabled:opacity-70">
                  Date Range
                </button>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm">
                  {statusOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                <button type="button" disabled className="h-11 rounded-md bg-violet-600 px-3 text-sm font-bold text-white shadow-sm disabled:opacity-70">
                  Manage Greetings
                </button>
              </div>

              <div className="mt-4 grid gap-5 xl:grid-cols-[330px_1fr_300px]">
                <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <h2 className="text-xs font-bold uppercase tracking-wide text-slate-600">Voicemail Inbox</h2>
                    <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-bold text-violet-700">{filtered.length}</span>
                  </div>
                  {filtered.length === 0 ? (
                    <div className="grid min-h-[360px] place-items-center p-6 text-center">
                      <div>
                        <Voicemail className="mx-auto size-10 text-slate-400" aria-hidden="true" />
                        <p className="mt-4 font-semibold">No voicemails found</p>
                        <p className="mt-2 text-sm text-slate-500">Twilio recordings will appear here when voicemail data exists.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-[560px] overflow-y-auto">
                      {filtered.map((voicemail) => {
                        const active = selected?.id === voicemail.id;
                        const displayName = voicemail.callerName || voicemail.phone || "Unknown caller";

                        return (
                          <button
                            key={voicemail.id}
                            type="button"
                            onClick={() => {
                              setSelectedId(voicemail.id);
                              setCurrentTime(0);
                            }}
                            className={`grid w-full grid-cols-[44px_1fr_auto] gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-violet-50/50 ${active ? "bg-violet-50 ring-1 ring-inset ring-violet-200" : ""}`}
                          >
                            <span className="relative grid size-10 place-items-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                              {initials(displayName)}
                              {(voicemail.status === "new" || voicemail.status === "unheard") ? <span className="absolute -left-1 top-1 size-2 rounded-full bg-violet-600" /> : null}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-bold text-slate-950">{displayName}</span>
                              <span className="block truncate text-xs text-slate-500">{voicemail.phone || "No phone number"}</span>
                              <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusClass(voicemail.status)}`}>
                                {statusLabel(voicemail.status)}
                              </span>
                            </span>
                            <span className="text-right text-xs text-slate-500">
                              <span className="block">{formatDateTime(voicemail.receivedAt)}</span>
                              <span className="mt-1 inline-flex items-center gap-1 font-mono">
                                <Mic2 className="size-3" aria-hidden="true" />
                                {formatCallDuration(voicemail.durationSeconds)}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <footer className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
                    Showing {filtered.length} of {voicemails.length} voicemails
                  </footer>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                  {selected ? (
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
                        <div className="flex items-center gap-4">
                          <div className="grid size-14 place-items-center rounded-full bg-violet-100 text-lg font-bold text-violet-700">
                            {initials(selected.callerName || selected.phone)}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold">{selected.callerName || selected.phone || "Unknown caller"}</h2>
                            <p className="text-sm text-slate-500">{selected.phone || "No phone number"}</p>
                          </div>
                        </div>
                        <div className="flex gap-8 text-sm">
                          <span><span className="block text-xs text-slate-500">Received</span>{formatDateTime(selected.receivedAt)}</span>
                          <span><span className="block text-xs text-slate-500">Duration</span>{formatCallDuration(selected.durationSeconds)}</span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                          {selected.recordingAvailable && selected.audioUrl ? (
                            <>
                              <audio
                                ref={audioRef}
                                src={selected.audioUrl}
                                onPlay={() => setPlaying(true)}
                                onPause={() => setPlaying(false)}
                                onEnded={() => setPlaying(false)}
                                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                                onLoadedMetadata={(event) => setCurrentTime(event.currentTarget.currentTime)}
                              />
                              <div className="flex items-center gap-4">
                                <button type="button" onClick={playPause} className="grid size-12 place-items-center rounded-full bg-violet-600 text-white">
                                  {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
                                  <span className="sr-only">{playing ? "Pause" : "Play"} voicemail</span>
                                </button>
                                <span className="font-mono text-sm">{formatCallDuration(Math.floor(currentTime))}</span>
                                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
                                  <div className="h-full rounded-full bg-violet-600" style={{ width: `${progress}%` }} />
                                </div>
                                <span className="font-mono text-sm">{formatCallDuration(selected.durationSeconds)}</span>
                                <select value={playbackRate} onChange={(event) => setRate(Number(event.target.value))} className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm">
                                  {[1, 1.25, 1.5, 2].map((rate) => <option key={rate} value={rate}>{rate}x</option>)}
                                </select>
                                <button type="button" onClick={() => {
                                  const nextMuted = !muted;
                                  setMuted(nextMuted);
                                  if (audioRef.current) audioRef.current.muted = nextMuted;
                                }} className="grid size-9 place-items-center rounded-md border border-slate-200 bg-white">
                                  {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                                  <span className="sr-only">{muted ? "Unmute" : "Mute"} voicemail</span>
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
                              Recording audio is unavailable for this voicemail.
                            </div>
                          )}
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-5">
                          <button type="button" onClick={() => selected.phone ? window.location.assign(`/calls?to=${encodeURIComponent(selected.phone)}`) : setMessage("No phone number available.")} className="rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-bold text-violet-700">Call Back</button>
                          <button type="button" onClick={() => updateVoicemailStatus(selected, { status: selected.status === "heard" ? "unheard" : "heard" })} className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-bold text-green-700">{selected.status === "heard" ? "Mark Unheard" : "Mark Heard"}</button>
                          <button type="button" onClick={() => updateVoicemailStatus(selected, { status: selected.archived ? "heard" : "archived", archived: !selected.archived })} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700">{selected.archived ? "Unarchive" : "Archive"}</button>
                          <button type="button" onClick={deleteVoicemail} className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">Delete</button>
                          <button type="button" onClick={addNote} className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">Add Note</button>
                        </div>

                        <section className="mt-5 rounded-lg border border-slate-200 p-4">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-slate-500" />
                            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">Transcript</h3>
                          </div>
                          {selected.transcript ? (
                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{selected.transcript}</p>
                          ) : (
                            <p className="mt-3 text-sm text-slate-500">Transcript unavailable.</p>
                          )}
                          {selected.transcriptConfidence != null ? (
                            <p className="mt-2 text-xs text-slate-500">Confidence: {selected.transcriptConfidence}</p>
                          ) : null}
                        </section>

                        <section className="mt-4 rounded-lg border border-slate-200 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">Internal Notes</h3>
                            <button type="button" onClick={addNote} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold">Add Note</button>
                          </div>
                          {selected.notes.length > 0 ? (
                            <div className="mt-3 space-y-2">
                              {selected.notes.map((note, index) => (
                                <p key={`${note}-${index}`} className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">{note}</p>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-3 text-sm text-slate-500">No internal notes for this voicemail.</p>
                          )}
                        </section>

                        <section className="mt-4 rounded-lg border border-slate-200 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">Follow-up Tasks</h3>
                            <button type="button" onClick={() => setMessage("Callback task workflow is not configured yet.")} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold">Add Task</button>
                          </div>
                          <p className="mt-3 text-sm text-slate-500">No follow-up tasks connected for this voicemail.</p>
                        </section>
                      </div>
                    </div>
                  ) : (
                    <div className="grid min-h-[600px] place-items-center p-8 text-center">
                      <div>
                        <Voicemail className="mx-auto size-12 text-slate-400" />
                        <h2 className="mt-4 text-lg font-bold">No voicemail selected</h2>
                        <p className="mt-2 text-sm text-slate-500">Select a voicemail from the inbox to review the recording.</p>
                      </div>
                    </div>
                  )}
                </section>

                <aside className="space-y-5">
                  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xs font-bold uppercase tracking-wide text-slate-600">Caller Details</h2>
                      <button type="button" disabled={!selected?.contact} className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:opacity-50">Edit</button>
                    </div>
                    {selected ? (
                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="grid size-14 place-items-center rounded-full bg-violet-100 text-lg font-bold text-violet-700">{initials(selected.callerName || selected.phone)}</div>
                          <div>
                            <p className="font-bold">{selected.callerName || selected.phone || "No caller match"}</p>
                            {selected.contact ? <p className="text-xs text-slate-500">{selected.contact.group}</p> : <p className="text-xs text-slate-500">No contact selected</p>}
                          </div>
                        </div>
                        <p><Phone className="mr-2 inline size-4 text-green-600" />{selected.phone || "No phone number"}</p>
                        <p><Mail className="mr-2 inline size-4 text-green-600" />{selected.contact?.email || "No email available"}</p>
                        <p>{selected.contact?.location || "No location available"}</p>
                        {selected.contact?.tags.length ? <p>{selected.contact.tags.join(", ")}</p> : null}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-500">Select a voicemail to view caller details.</p>
                    )}
                  </section>

                  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-xs font-bold uppercase tracking-wide text-slate-600">Quick Actions</h2>
                    <div className="mt-4 space-y-2">
                      <button type="button" disabled={!selected?.phone} onClick={() => selected?.phone ? window.location.assign(`/calls?to=${encodeURIComponent(selected.phone)}`) : undefined} className="flex h-10 w-full items-center gap-3 rounded-md border border-slate-200 px-3 text-sm font-bold disabled:opacity-50"><Phone className="size-4 text-green-600" />Call Contact</button>
                      <button type="button" disabled={!selected?.phone} onClick={() => selected?.phone ? window.location.assign(`/messages?phone=${encodeURIComponent(selected.phone)}`) : undefined} className="flex h-10 w-full items-center gap-3 rounded-md border border-slate-200 px-3 text-sm font-bold disabled:opacity-50"><Send className="size-4 text-blue-600" />Send Message</button>
                      <button type="button" disabled={!selected?.contact?.email} onClick={() => selected?.contact?.email ? window.location.assign(`mailto:${selected.contact.email}`) : undefined} className="flex h-10 w-full items-center gap-3 rounded-md border border-slate-200 px-3 text-sm font-bold disabled:opacity-50"><Mail className="size-4 text-violet-600" />Send Email</button>
                      <button type="button" disabled={!selected} onClick={addNote} className="flex h-10 w-full items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-3 text-sm font-bold text-amber-700 disabled:opacity-50"><FileText className="size-4" />Add Note</button>
                      <button type="button" disabled={!selected} onClick={() => setMessage("Callback scheduling is not configured yet.")} className="flex h-10 w-full items-center gap-3 rounded-md border border-rose-200 bg-rose-50 px-3 text-sm font-bold text-rose-700 disabled:opacity-50"><CalendarClock className="size-4" />Schedule Callback</button>
                    </div>
                  </section>

                  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-xs font-bold uppercase tracking-wide text-slate-600">Mailbox & Greeting</h2>
                    <div className="mt-4 space-y-3 text-sm">
                      <p><span className="block text-xs text-slate-500">Active Greeting</span>{mailbox.activeGreeting || "No greeting data connected"}</p>
                      <p><span className="block text-xs text-slate-500">Mailbox Health</span>{mailbox.mailboxHealth}</p>
                      <p><span className="block text-xs text-slate-500">Voicemails this month</span>{mailbox.currentMonthCount}</p>
                      <button type="button" disabled className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 disabled:opacity-60">
                        Manage greetings <RotateCcw className="size-4" />
                      </button>
                    </div>
                  </section>
                </aside>
              </div>
            </div>
          </div>
          <CallControlBar />
        </div>
      </div>
      {message ? (
        <div className="fixed bottom-24 right-6 z-50 max-w-sm rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 shadow-lg">
          {message}
          <button type="button" onClick={() => setMessage(null)} className="ml-4 underline">Close</button>
        </div>
      ) : null}
    </main>
  );
}
