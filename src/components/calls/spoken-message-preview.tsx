import { Bot, Check, AudioLines } from "lucide-react";
import type { CallerRecord, ZohoLeadSnapshot } from "@/lib/types";

type SpokenMessagePreviewProps = {
  message: string | null;
  caller?: CallerRecord | null;
  record?: ZohoLeadSnapshot | null;
};

export function SpokenMessagePreview({ message, caller, record }: SpokenMessagePreviewProps) {
  const rows = [
    ["Caller", caller?.name || "No active caller"],
    ["Phone", caller?.phone || "No live phone"],
    ["Recognition", caller?.recognized ? "Recognized Caller" : "No contact match"],
    ["Lead Status", record?.leadStatus || caller?.leadStatus || "No live data"],
    ["Puppy Interest", caller?.puppyInterest || "No live data"],
  ];

  return (
    <section className="h-[308px] rounded-[13px] border border-[#eee7df] bg-white p-6 shadow-[0_16px_48px_rgba(68,58,45,0.06)]">
      <div className="flex items-center gap-3">
        <AudioLines className="size-6 text-[#6e48d7]" aria-hidden="true" />
        <h2 className="text-[14px] font-semibold text-[#5b37c9]">
          AI Greeting / Spoken Message Preview
        </h2>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_172px]">
        <div className="flex items-center justify-center gap-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ded0ff] text-[#6b42c7]">
          <Bot className="size-6" aria-hidden="true" />
        </div>
        <div className="max-w-[296px] rounded-[14px] bg-gradient-to-br from-[#f3ecfb] to-[#f6edf5] px-5 py-4 text-[15px] font-medium leading-[22px] text-[#151226] shadow-inner">
          {message ? (
            <>&ldquo;{message}&rdquo;</>
          ) : (
            <span className="text-stone-500">
              No spoken message yet. This will display the message returned by the Twilio caller
              lookup flow.
            </span>
          )}
        </div>
        </div>
        <dl className="rounded-lg border border-violet-100 bg-violet-50/50 p-3 text-[11px]">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[72px_1fr] gap-2 py-1">
              <dt className="font-semibold text-violet-700">{label}</dt>
              <dd className="truncate text-stone-800">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#f5eefb] px-3 py-1 text-xs font-medium text-[#6f4cb0]">
          <Check className="size-3.5" aria-hidden="true" />
          {message ? "Personalized for recognized caller" : "Waiting for lookup response"}
        </span>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
          Source: Twilio call + Supabase contact
        </span>
      </div>
    </section>
  );
}
