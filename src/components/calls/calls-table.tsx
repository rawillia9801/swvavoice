"use client";

import { CalendarDays, Filter } from "lucide-react";
import { EmptyCallsState } from "@/components/calls/empty-calls-state";
import type { CallRecord, CallsTab } from "@/lib/calls/types";

const tabs: CallsTab[] = ["All Calls", "Inbound", "Outbound", "Missed", "Voicemails"];
const columns = ["Caller", "Type", "Status", "Time / Date", "Duration", "Agent", "Tags / Notes", "Actions"];

type CallsTableProps = {
  calls: CallRecord[];
  activeTab: CallsTab;
  onTabChange: (tab: CallsTab) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
};

export function CallsTable({
  calls,
  activeTab,
  onTabChange,
  filtersOpen,
  onToggleFilters,
}: CallsTableProps) {
  return (
    <section className="mt-7">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`border-b-2 px-1 pb-4 text-sm font-medium ${
                activeTab === tab
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-slate-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleFilters}
            className="inline-flex h-10 items-center gap-3 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm"
          >
            Date Range
            <CalendarDays className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-3 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm"
          >
            <Filter className="size-4" aria-hidden="true" />
            Filters
          </button>
        </div>
      </div>

      {filtersOpen ? (
        <div className="mt-3 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm md:grid-cols-4">
          {["Direction", "Status", "Recognized caller", "Date range"].map((label) => (
            <label key={label} className="space-y-1">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
              </span>
              <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3">
                <option>All</option>
              </select>
            </label>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-[1.2fr_0.7fr_0.8fr_1fr_0.7fr_0.8fr_1.2fr_0.5fr] border-x border-slate-200 bg-white px-4 py-4 text-xs font-semibold text-slate-500">
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>

      {calls.length === 0 ? <EmptyCallsState /> : null}
    </section>
  );
}
