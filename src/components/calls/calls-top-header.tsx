"use client";

import { Bell, CircleHelp, Menu, PhoneCall, Search } from "lucide-react";

type CallsTopHeaderProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function CallsTopHeader({ searchValue = "", onSearchChange }: CallsTopHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center gap-5 border-b border-slate-200 bg-white/92 px-7 backdrop-blur">
      <button
        type="button"
        className="grid size-9 place-items-center rounded-md text-slate-800 hover:bg-slate-100"
        aria-label="Open menu"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <label className="relative hidden w-[322px] md:block">
        <span className="sr-only">Search calls, contacts, notes</span>
        <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <input
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          className="h-10 w-full rounded-md border border-slate-200 bg-slate-100/70 px-4 pr-10 text-sm outline-none transition focus:border-violet-300 focus:bg-white"
          placeholder="Search calls, contacts, notes..."
          type="search"
        />
      </label>

      <div className="ml-auto flex items-center gap-4">
        <div className="hidden h-10 items-center gap-3 rounded-md border border-green-200 bg-green-50 px-4 text-sm font-semibold text-green-700 lg:flex">
          <PhoneCall className="size-4" aria-hidden="true" />
          Ready for Calls
          <span className="font-mono text-slate-900">--:--</span>
        </div>
        <div className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 lg:flex">
          <span className="grid size-5 place-items-center rounded-full border-2 border-red-500 text-[10px] text-red-600">
            tw
          </span>
          Twilio Connected
        </div>
        <button type="button" className="relative grid size-9 place-items-center rounded-full text-slate-800">
          <Bell className="size-5" aria-hidden="true" />
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
            !
          </span>
        </button>
        <button type="button" className="grid size-9 place-items-center rounded-full text-slate-800">
          <CircleHelp className="size-5" aria-hidden="true" />
        </button>
        <div className="grid size-10 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">
          AD
        </div>
      </div>
    </header>
  );
}
