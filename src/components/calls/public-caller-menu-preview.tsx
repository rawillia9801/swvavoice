import { Volume2 } from "lucide-react";
import type { MenuOption } from "@/lib/types";

type PublicCallerMenuPreviewProps = {
  options: MenuOption[];
};

export function PublicCallerMenuPreview({ options }: PublicCallerMenuPreviewProps) {
  return (
    <section className="rounded-[8px] border border-[#e9e2da] bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-md border border-stone-200 bg-stone-50 text-stone-600">
          <Volume2 className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-teal-800">
              Public / New Caller Menu Preview
            </h2>
            <p className="text-xs text-stone-500">(Unrecognized callers will hear this menu)</p>
          </div>
          <div className="mt-2 grid gap-2 md:grid-cols-3 xl:grid-cols-6">
            {options.map((option) => (
              <div
                key={option.key}
                className="flex min-h-[34px] items-center gap-2 rounded-md border border-stone-100 bg-stone-50/70 px-3"
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
