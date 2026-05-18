import { ClipboardList, Plus } from "lucide-react";
import type { CallNote } from "@/lib/types";

type CallNotesProps = {
  notes: CallNote[];
};

export function CallNotes({ notes }: CallNotesProps) {
  return (
    <section className="rounded-[10px] border border-[#eee7df] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-4 text-stone-500" aria-hidden="true" />
          <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700">Call Notes</h2>
        </div>
        <button
          type="button"
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
