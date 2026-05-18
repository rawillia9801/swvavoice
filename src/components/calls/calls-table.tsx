"use client";

import { CalendarDays, Filter } from "lucide-react";
import { MoreHorizontal, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import { CallStatusBadge } from "@/components/calls/call-status-badge";
import { EmptyCallsState } from "@/components/calls/empty-calls-state";
import { RecognitionBadge } from "@/components/calls/recognition-badge";
import { formatCallDuration } from "@/lib/calls/format-call-duration";
import type { CallRecord, CallsTab } from "@/lib/calls/types";

const tabs: CallsTab[] = ["All Calls", "Inbound", "Outbound", "Missed", "Voicemails"];
const columns = ["Caller", "Type", "Status", "Time / Date", "Duration", "Agent", "Tags / Notes", "Actions"];

function formatDateTime(value?: string | null) {
  if (!value) {
    return { time: "—", date: "—" };
  }

  const date = new Date(value);

  return {
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
    date: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date),
  };
}

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

      {calls.length === 0 ? (
        <EmptyCallsState />
      ) : (
        <div className="overflow-hidden rounded-b-lg border-x border-b border-slate-200 bg-white">
          {calls.map((call) => {
            const started = formatDateTime(call.startedAt);
            const DirectionIcon = call.direction === "outbound" ? PhoneOutgoing : PhoneIncoming;

            return (
              <div
                key={call.id}
                className="grid min-h-20 grid-cols-[1.2fr_0.7fr_0.8fr_1fr_0.7fr_0.8fr_1.2fr_0.5fr] items-center border-t border-slate-100 px-4 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">
                    {call.callerName || "Unknown caller"}
                  </p>
                  <p className="truncate text-slate-500">{call.phone || "No phone number"}</p>
                  <RecognitionBadge status={call.recognitionStatus} />
                </div>
                <div className="flex items-center gap-2 capitalize text-slate-700">
                  <DirectionIcon className="size-4 text-green-600" aria-hidden="true" />
                  {call.direction}
                </div>
                <CallStatusBadge status={call.status} />
                <div>
                  <p className="font-medium text-slate-900">{started.time}</p>
                  <p className="text-xs text-slate-500">{started.date}</p>
                </div>
                <p className="font-mono text-slate-700">
                  {formatCallDuration(call.durationSeconds)}
                </p>
                <p className="text-slate-600">{call.agentName || "—"}</p>
                <div className="min-w-0">
                  {call.tags && call.tags.length > 0 ? (
                    <p className="truncate text-slate-700">{call.tags.join(", ")}</p>
                  ) : (
                    <p className="text-slate-400">—</p>
                  )}
                  {call.notes ? <p className="truncate text-xs text-slate-500">{call.notes}</p> : null}
                </div>
                <button
                  type="button"
                  className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600"
                  aria-label="Call row actions"
                >
                  <MoreHorizontal className="size-4" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
