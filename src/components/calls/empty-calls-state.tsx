import { RefreshCw } from "lucide-react";

export function EmptyCallsState() {
  return (
    <div className="grid min-h-[360px] place-items-center rounded-b-lg border-x border-b border-slate-200 bg-white">
      <div className="max-w-sm text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-slate-100 text-slate-600">
          <RefreshCw className="size-5" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-950">No calls found</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Calls will appear here once Twilio call activity is connected.
        </p>
        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Refresh
        </button>
      </div>
    </div>
  );
}
