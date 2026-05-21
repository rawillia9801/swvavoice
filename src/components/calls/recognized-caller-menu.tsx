"use client";

import type { MenuOption } from "@/lib/types";
import { getIcon } from "@/components/icons";
import { ArrowRight, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";

type RecognizedCallerMenuProps = {
  options: MenuOption[];
  publicOptions: MenuOption[];
};

const accentClasses = [
  "from-teal-50 to-cyan-50 text-teal-700 border-teal-100",
  "from-emerald-50 to-teal-50 text-emerald-700 border-emerald-100",
  "from-sky-50 to-blue-50 text-blue-700 border-sky-100",
  "from-violet-50 to-purple-50 text-violet-700 border-violet-100",
  "from-rose-50 to-red-50 text-rose-700 border-rose-100",
  "from-amber-50 to-orange-50 text-amber-700 border-amber-100",
  "from-orange-50 to-stone-50 text-orange-800 border-orange-100",
];

const routeByOption: Record<string, string> = {
  "Pickup / Delivery": "/pickups-delivery",
  Balance: "/payments",
  "Puppy Payment Info": "/payments",
  "Reservation Details": "/customers",
  "Application Status": "/customers",
  "Leave a Message": "/voicemail",
  "Speak With Someone": "/calls",
};

export function RecognizedCallerMenu({ options, publicOptions }: RecognizedCallerMenuProps) {
  const [selectedKey, setSelectedKey] = useState(options[0]?.key || "");
  const selected = useMemo(
    () => options.find((option) => option.key === selectedKey) || options[0] || null,
    [options, selectedKey],
  );
  const selectedRoute = selected ? routeByOption[selected.label] || "/calls" : "/calls";

  return (
    <section className="rounded-[10px] border border-[#eee7df] bg-white px-5 py-3 shadow-[0_16px_48px_rgba(68,58,45,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-[#00736d]">
            Recognized Caller Menu
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-stone-600">
          <span>DTMF: On</span>
          <span className="h-3 w-px bg-stone-300" />
          <span>Language: English</span>
        </div>
      </div>

      <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
        {options.map((option, index) => {
          const Icon = getIcon(option.icon);
          const active = selected?.key === option.key;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setSelectedKey(option.key)}
              className={`h-[103px] rounded-[8px] border bg-gradient-to-br px-3 py-2 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                active ? "ring-2 ring-[#00736d] ring-offset-2" : ""
              } ${accentClasses[index % accentClasses.length]}`}
              aria-pressed={active}
            >
              <div className="mx-auto grid size-9 place-items-center rounded-full bg-white/70 shadow-sm">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <p className="mt-1 font-mono text-sm font-bold text-stone-950">{option.key}</p>
              <p className="mt-1 text-[12px] font-semibold leading-[15px] text-stone-950">{option.label}</p>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-teal-100 bg-teal-50 px-3 py-2">
          <div>
            <p className="text-xs font-bold text-teal-900">
              Press {selected.key}: {selected.label}
            </p>
            <p className="mt-1 text-xs text-teal-800">{selected.description}</p>
          </div>
          <button
            type="button"
            onClick={() => window.location.assign(selectedRoute)}
            className="inline-flex items-center gap-2 rounded-md border border-teal-200 bg-white px-3 py-2 text-xs font-bold text-teal-800 shadow-sm hover:bg-teal-100"
          >
            Open Workspace
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="mt-2 flex items-center gap-3 rounded-[8px] border border-[#e9e2da] bg-white px-3 py-1.5 shadow-sm">
        <div className="grid size-9 shrink-0 place-items-center rounded-md border border-stone-200 bg-stone-50 text-stone-600">
          <Volume2 className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#00736d]">
              Public / New Caller Menu Preview
            </h3>
            <p className="text-xs text-stone-500">(Unrecognized callers will hear this menu)</p>
          </div>
          <div className="mt-2 grid gap-2 md:grid-cols-3 xl:grid-cols-6">
            {publicOptions.map((option) => (
              <div
                key={option.key}
                className="flex min-h-[28px] items-center gap-2 rounded-md border border-stone-100 bg-stone-50/70 px-3"
              >
                <span className="font-mono text-sm font-bold text-stone-950">{option.key}</span>
                <span className="text-[11px] font-semibold leading-[13px] text-stone-700">
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
