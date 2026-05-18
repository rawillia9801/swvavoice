import { ExternalLink, UserRound } from "lucide-react";
import type { ZohoLeadSnapshot } from "@/lib/types";

type ZohoRecordSnapshotProps = {
  record: ZohoLeadSnapshot | null;
};

export function ZohoRecordSnapshot({ record }: ZohoRecordSnapshotProps) {
  if (!record) {
    return (
      <section className="h-[282px] overflow-hidden rounded-[13px] border border-[#eee7df] bg-white p-4 shadow-[0_16px_48px_rgba(68,58,45,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700">
            CRM / ZOHO RECORD SNAPSHOT
          </h2>
        </div>
        <div className="mt-8 rounded-md border border-dashed border-stone-200 bg-stone-50/70 p-4">
          <p className="text-sm font-semibold text-stone-800">No Zoho record loaded</p>
          <p className="mt-2 text-sm leading-5 text-stone-500">
            When a live caller is recognized, the Zoho Lead or Contact fields will appear here.
          </p>
        </div>
      </section>
    );
  }

  const rows = [
    ["Contact", `${record.phone}  •  ${record.email}`],
    ["Lead Status", record.leadStatus],
    ["Preferred Sex", record.preferredSex],
    ["Preferred Coat", record.preferredCoat],
    ["Preferred Timing", record.preferredTiming],
    ["Next Step", record.nextStep],
    ["Last Contacted", record.lastContacted],
  ];

  return (
    <section className="h-[282px] overflow-hidden rounded-[13px] border border-[#eee7df] bg-white p-4 shadow-[0_16px_48px_rgba(68,58,45,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700">
          CRM / ZOHO RECORD SNAPSHOT
        </h2>
        <button
          type="button"
          className="grid size-8 place-items-center rounded-md border border-stone-200 text-stone-500"
          aria-label="Open Zoho record"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full border border-stone-200 bg-stone-50 text-stone-500">
          <UserRound className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-stone-950">{record.name}</p>
        </div>
        <span className="rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800">
          {record.leadStatus}
        </span>
      </div>

      <dl className="mt-3 space-y-1.5">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[104px_1fr] gap-3 text-[11.5px]">
            <dt className="text-stone-500">{label}</dt>
            <dd className="font-medium text-stone-900">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
