"use client";

import { ClipboardList, Plus } from "lucide-react";
import type { CallerRecord, CallNote } from "@/lib/types";
import { useState } from "react";

type CallNotesProps = {
  notes: CallNote[];
  activeCaller?: CallerRecord | null;
};

export function CallNotes({ notes, activeCaller }: CallNotesProps) {
  const [notice, setNotice] = useState<string | null>(null);

  const addNote = async () => {
    if (!activeCaller) {
      setNotice("No active caller selected.");
      return;
    }

    const body = window.prompt("Add call note");
    if (!body?.trim()) {
      return;
    }

    const response = await fetch("/api/call-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body,
        callId: activeCaller.id,
        phone: activeCaller.phone,
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string; savedTo?: string };

    if (!response.ok) {
      setNotice(payload.error || "Call note could not be saved.");
      return;
    }

    setNotice(`Call note saved to ${payload.savedTo || "Supabase"}. Refresh to see it here.`);
  };

  return (
    <section className="rounded-[10px] border border-[#eee7df] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-4 text-stone-500" aria-hidden="true" />
          <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700">Call Notes</h2>
        </div>
        <button
          type="button"
          onClick={addNote}
          className="inline-flex items-center gap-1 rounded-md border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Add Note
        </button>
      </div>
      {notes.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-stone-200 bg-stone-50/70 p-4">
          <p className="text-sm font-semibold text-stone-800">No call notes</p>
          <p className="mt-2 text-xs leading-5 text-stone-500">
            Notes will be attached to real call and CRM records once saving is wired.
          </p>
        </div>
      ) : null}
      {notice ? (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          {notice}
          <button type="button" onClick={() => setNotice(null)} className="ml-3 underline">
            Close
          </button>
        </div>
      ) : null}
      <div className="mt-4 space-y-3">
        {notes.map((note) => (
          <article key={note.id} className="rounded-md border border-stone-200 bg-stone-50/60 p-3">
            <p className="text-xs text-stone-500">
              {note.timestamp} <span className="mx-1">-</span> {note.author}
            </p>
            <p className="mt-2 whitespace-pre-line text-[13px] leading-5 text-stone-700">{note.body}</p>
            <span className="mt-4 inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              {note.followUpDate}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
