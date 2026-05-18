import { ArrowRight, MessageSquareText } from "lucide-react";
import type { MessageTemplate } from "@/lib/types";

type MessageTemplatesProps = {
  templates: MessageTemplate[];
};

export function MessageTemplates({ templates }: MessageTemplatesProps) {
  return (
    <section className="rounded-[10px] border border-[#eee7df] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <MessageSquareText className="size-4 text-stone-500" aria-hidden="true" />
        <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700">
          Message Templates
        </h2>
      </div>
      {templates.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-stone-200 bg-stone-50/70 p-4">
          <p className="text-sm font-semibold text-stone-800">No templates configured</p>
          <p className="mt-2 text-xs leading-5 text-stone-500">
            Business-approved SMS and email templates can be added here later.
          </p>
        </div>
      ) : null}
      <div className="mt-3 space-y-2.5">
        {templates.map((template) => (
          <article key={template.id} className="flex gap-3">
            <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-stone-200 bg-stone-50 text-stone-500">
              <MessageSquareText className="size-3.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-stone-950">{template.name}</p>
              <p className="truncate text-xs text-stone-500">{template.preview}</p>
            </div>
          </article>
        ))}
      </div>
      <a href="#" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
        View all templates <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </section>
  );
}
