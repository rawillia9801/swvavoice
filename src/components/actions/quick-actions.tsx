import { ArrowRight, Zap } from "lucide-react";
import { getIcon } from "@/components/icons";
import type { QuickAction } from "@/lib/types";

type QuickActionsProps = {
  actions: QuickAction[];
};

const actionClass = {
  sms: "border-teal-200 bg-teal-50 text-teal-800",
  email: "border-blue-200 bg-blue-50 text-blue-800",
  "zoho-task": "border-violet-200 bg-violet-50 text-violet-800",
  "call-note": "border-amber-200 bg-amber-50 text-amber-800",
  callback: "border-rose-200 bg-rose-50 text-rose-800",
};

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section className="rounded-[10px] border border-[#eee7df] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Zap className="size-4 text-stone-500" aria-hidden="true" />
        <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700">Quick Actions</h2>
      </div>
      <div className="mt-3 space-y-1.5">
        {actions.map((action) => {
          const Icon = getIcon(action.icon);

          return (
            <button
              key={action.id}
              type="button"
              className={`flex w-full items-center gap-3 rounded-md border px-3 py-1.5 text-left text-[12px] font-semibold transition hover:brightness-95 ${actionClass[action.actionType]}`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {action.label}
            </button>
          );
        })}
      </div>
      <a href="#" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-teal-700">
        View all actions <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </section>
  );
}
