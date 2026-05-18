import { ArrowRight, Play, Voicemail as VoicemailIcon } from "lucide-react";
import type { Voicemail } from "@/lib/types";

type VoicemailInboxProps = {
  voicemails: Voicemail[];
};

export function VoicemailInbox({ voicemails }: VoicemailInboxProps) {
  const unreadCount = voicemails.filter((voicemail) => !voicemail.listened).length;

  return (
    <section className="rounded-[10px] border border-[#eee7df] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VoicemailIcon className="size-4 text-stone-500" aria-hidden="true" />
          <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700">
            Voicemail Inbox
          </h2>
        </div>
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
          {unreadCount}
        </span>
      </div>
      {voicemails.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-stone-200 bg-stone-50/70 p-4">
          <p className="text-sm font-semibold text-stone-800">No voicemail loaded</p>
          <p className="mt-2 text-xs leading-5 text-stone-500">
            Voicemail records will appear after Twilio voicemail storage is connected.
          </p>
        </div>
      ) : null}
      <div className="mt-3 space-y-3">
        {voicemails.map((voicemail) => (
          <div key={voicemail.id} className="flex items-center gap-3">
            <button
              type="button"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-stone-200 text-stone-600"
              aria-label={`Play voicemail from ${voicemail.name}`}
            >
              <Play className="ml-0.5 size-4" aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-stone-950">{voicemail.name}</p>
              <p className="text-xs text-stone-500">{voicemail.phone}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-stone-700">{voicemail.duration}</p>
              <p className="text-xs text-stone-500">{voicemail.dateLabel}</p>
            </div>
          </div>
        ))}
      </div>
      <a href="#" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
        View all voicemails <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </section>
  );
}
