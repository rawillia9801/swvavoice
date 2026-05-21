"use client";

import { Bell, ChevronDown, CircleHelp, PhoneCall } from "lucide-react";
import { useState } from "react";

export function TopHeader() {
  const [openPanel, setOpenPanel] = useState<"notifications" | "help" | "profile" | null>(null);

  return (
    <header className="sticky top-0 z-20 flex h-[78px] items-center justify-between border-b border-[#eee7df] bg-[#fffefa]/90 px-4 backdrop-blur lg:px-5">
      <div className="flex items-center gap-3 xl:hidden">
        <div className="grid size-10 place-items-center rounded-full bg-teal-50 text-teal-700">
          <PhoneCall className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-950">Southwest Virginia Chihuahua</p>
          <p className="text-xs text-stone-500">Smart VOIP & Customer Care</p>
        </div>
      </div>

      <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
        <div className="flex h-[40px] items-center gap-3 rounded-full border border-[#dbeed6] bg-[#edf8e9] px-5 text-[14px] font-semibold text-[#16713b] shadow-sm">
          <PhoneCall className="size-4" aria-hidden="true" />
          <span>Ready for Calls</span>
          <span className="font-mono font-medium text-stone-800">--:--</span>
        </div>
        <div className="h-8 w-px bg-stone-200" />
        <div className="flex items-center gap-2 text-sm font-semibold text-[#e3212b]">
          <span className="grid size-8 place-items-center rounded-full border-2 border-[#e3212b] text-[14px]">
            tw
          </span>
          <span className="text-[10px] uppercase tracking-wide text-stone-400">Powered by</span>
          <span className="text-2xl lowercase tracking-tight">twilio</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPanel((current) => current === "notifications" ? null : "notifications")}
            className="relative grid size-10 place-items-center rounded-full border border-transparent bg-transparent text-stone-600 hover:bg-stone-100"
            aria-label="Notifications"
            aria-expanded={openPanel === "notifications"}
          >
            <Bell className="size-5" aria-hidden="true" />
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-amber-400 text-[11px] font-bold text-white">
              3
            </span>
          </button>
          {openPanel === "notifications" ? (
            <div className="absolute right-0 top-12 z-40 w-72 rounded-lg border border-stone-200 bg-white p-4 text-sm shadow-xl">
              <p className="font-bold text-stone-950">Notifications</p>
              <p className="mt-2 text-stone-600">Live dashboard alerts will appear here.</p>
            </div>
          ) : null}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPanel((current) => current === "help" ? null : "help")}
            className="grid size-10 place-items-center rounded-full border border-transparent bg-transparent text-stone-600 hover:bg-stone-100"
            aria-label="Help"
            aria-expanded={openPanel === "help"}
          >
            <CircleHelp className="size-5" aria-hidden="true" />
          </button>
          {openPanel === "help" ? (
            <div className="absolute right-0 top-12 z-40 w-72 rounded-lg border border-stone-200 bg-white p-4 text-sm shadow-xl">
              <p className="font-bold text-stone-950">Help</p>
              <p className="mt-2 text-stone-600">
                Use Calls for Twilio testing, Contacts for Supabase records, and Dashboard for live call monitoring.
              </p>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setOpenPanel((current) => current === "profile" ? null : "profile")}
          className="relative hidden items-center gap-3 border-l border-stone-200 pl-4 sm:flex"
          aria-expanded={openPanel === "profile"}
        >
          <div className="relative grid size-[42px] place-items-center rounded-full bg-gradient-to-br from-teal-50 to-amber-50 text-sm font-bold text-teal-800">
            AD
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-green-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-950">Admin</p>
            <p className="text-xs text-stone-500">Admin</p>
          </div>
          <ChevronDown className="size-4 text-stone-500" aria-hidden="true" />
          {openPanel === "profile" ? (
            <div className="absolute right-0 top-14 z-40 w-64 rounded-lg border border-stone-200 bg-white p-4 text-left text-sm shadow-xl">
              <p className="font-bold text-stone-950">Admin session</p>
              <p className="mt-2 text-stone-600">Password-gated dashboard session is active.</p>
              <a href="/settings" className="mt-3 inline-flex font-semibold text-teal-700">
                Open Settings
              </a>
            </div>
          ) : null}
        </button>
      </div>
    </header>
  );
}
