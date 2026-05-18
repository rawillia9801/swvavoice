import { CircleDot } from "lucide-react";
import type { CallTimelineEvent } from "@/lib/types";

type CallTimelineProps = {
  events: CallTimelineEvent[];
};

const eventColor = {
  lookup: "bg-teal-500",
  crm: "bg-blue-500",
  menu: "bg-violet-500",
  routing: "bg-amber-500",
};

export function CallTimeline({ events }: CallTimelineProps) {
  return (
    <section className="h-[242px] overflow-hidden rounded-[13px] border border-[#eee7df] bg-white p-4 shadow-[0_16px_48px_rgba(68,58,45,0.05)]">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700">Call Timeline</h2>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-700">
          Live <span className="size-2 rounded-full bg-green-500" />
        </span>
      </div>
      {events.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-stone-200 bg-stone-50/70 p-4">
          <p className="text-sm font-semibold text-stone-800">No live call events</p>
          <p className="mt-2 text-sm leading-5 text-stone-500">
            Twilio lookup, Zoho match, menu selection, and routing events will appear here.
          </p>
        </div>
      ) : null}
      <div className="mt-4 space-y-3.5">
        {events.map((event, index) => (
          <div key={event.id} className="relative flex gap-4">
            {index < events.length - 1 ? (
              <span className="absolute left-2 top-5 h-[calc(100%+0.5rem)] w-px bg-stone-200" />
            ) : null}
            <span
              className={`relative z-10 mt-1 grid size-4 shrink-0 place-items-center rounded-full ${eventColor[event.type]}`}
            >
              <CircleDot className="size-3 text-white" aria-hidden="true" />
            </span>
            <div className="grid flex-1 gap-1 sm:grid-cols-[92px_1fr]">
              <time className="font-mono text-[11px] text-stone-500">{event.time}</time>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-stone-950">{event.title}</p>
                <p className="text-[12px] leading-[15px] text-stone-500">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
