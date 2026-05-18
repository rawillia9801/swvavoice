import { ArrowRight } from "lucide-react";
import type { RecentCall } from "@/lib/types";

type RecentCallsProps = {
  calls: RecentCall[];
};

export function RecentCalls({ calls }: RecentCallsProps) {
  return (
    <section className="rounded-[10px] border border-[#eee7df] bg-white p-4 shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700">Recent Calls</h2>
      {calls.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-stone-200 bg-stone-50/70 p-4">
          <p className="text-sm font-semibold text-stone-800">No call records loaded</p>
          <p className="mt-2 text-xs leading-5 text-stone-500">
            Recent calls will appear after Twilio call history is connected.
          </p>
        </div>
      ) : null}
      <div className="mt-3 space-y-2.5">
        {calls.map((call) => (
          <div key={call.id} className="flex items-center gap-3">
            <div
              className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
                call.recognized ? "bg-teal-50 text-teal-700" : "bg-violet-50 text-violet-700"
              }`}
            >
              {call.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-stone-950">{call.name}</p>
              <p className="text-xs text-stone-500">{call.phone}</p>
            </div>
            <div className="text-right">
              <p
                className={`text-xs font-semibold ${
                  call.status === "Active" ? "text-green-700" : "text-stone-500"
                }`}
              >
                {call.dateLabel}
              </p>
              <p className="font-mono text-xs text-stone-600">{call.duration}</p>
            </div>
          </div>
        ))}
      </div>
      <a href="#" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
        View all calls <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </section>
  );
}
