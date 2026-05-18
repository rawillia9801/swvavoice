import { Check, MapPin, PhoneCall } from "lucide-react";
import type { CallerRecord } from "@/lib/types";

type ActiveCallCardProps = {
  caller: CallerRecord | null;
};

export function ActiveCallCard({ caller }: ActiveCallCardProps) {
  if (!caller) {
    return (
      <section className="h-[308px] overflow-hidden rounded-[13px] border border-[#eee7df] bg-white px-6 py-5 shadow-[0_16px_48px_rgba(68,58,45,0.06)]">
        <div className="flex h-full flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#00736d]">
              Waiting for Incoming Call
            </p>
            <h1 className="mt-3 text-[23px] font-semibold tracking-tight text-[#121827]">
              No active caller
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500">
              This panel will populate from Twilio call events and the Zoho caller lookup response.
            </p>
          </div>

          <dl className="divide-y divide-[#ece8e2] border-t border-[#ece8e2] text-[13px]">
            {["Lead Status", "Puppy Interest", "Next Step", "Notes"].map((label) => (
              <div key={label} className="grid gap-1 py-2 sm:grid-cols-[145px_1fr]">
                <dt className="text-stone-500">{label}</dt>
                <dd className="font-medium text-stone-400">No live data</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    );
  }

  return (
    <section className="h-[308px] overflow-hidden rounded-[13px] border border-[#eee7df] bg-white px-6 py-5 shadow-[0_16px_48px_rgba(68,58,45,0.06)]">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="relative mx-auto grid size-[108px] shrink-0 place-items-center overflow-visible rounded-full bg-gradient-to-br from-teal-50 to-amber-50 text-3xl font-semibold text-teal-800 sm:mx-0">
          {caller.name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")}
          <span className="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full bg-teal-600 text-white shadow-md">
            <PhoneCall className="size-4" aria-hidden="true" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-[#ff4152]">Incoming Call</p>
            {caller.recognized ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#9dd8d2] bg-[#effaf8] px-2.5 py-1 text-[11px] font-semibold text-[#00736d]">
                <Check className="size-3.5" aria-hidden="true" />
                Recognized Caller
              </span>
            ) : null}
          </div>
          <h1 className="mt-3 text-[23px] font-semibold tracking-tight text-[#121827]">
            {caller.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-[14px] text-stone-600">
            <span className="font-medium text-stone-900">{caller.phone}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-4" aria-hidden="true" />
              {caller.location}
            </span>
          </div>
        </div>
      </div>

      <dl className="mt-3 divide-y divide-[#ece8e2] border-t border-[#ece8e2] text-[13px]">
        <div className="grid gap-1 py-2 sm:grid-cols-[145px_1fr]">
          <dt className="text-stone-500">Lead Status</dt>
          <dd className="flex items-center gap-2 font-semibold text-stone-950">
            <span className="size-2 rounded-full bg-green-500" />
            {caller.leadStatus}
          </dd>
        </div>
        <div className="grid gap-1 py-2 sm:grid-cols-[145px_1fr]">
          <dt className="text-stone-500">Puppy Interest</dt>
          <dd className="font-semibold text-stone-950">{caller.puppyInterest}</dd>
        </div>
        <div className="grid gap-1 py-2 sm:grid-cols-[145px_1fr]">
          <dt className="text-stone-500">Next Step</dt>
          <dd className="font-semibold text-stone-950">{caller.nextStep}</dd>
        </div>
        <div className="grid gap-1 py-2 sm:grid-cols-[145px_1fr]">
          <dt className="text-stone-500">Notes</dt>
          <dd className="font-medium leading-5 text-stone-800">{caller.notes}</dd>
        </div>
      </dl>
    </section>
  );
}
