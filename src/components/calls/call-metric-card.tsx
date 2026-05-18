import { CheckCircle2, Clock3, Phone, Voicemail } from "lucide-react";
import type { CallMetric } from "@/lib/calls/types";

const iconById = {
  "todays-calls": Phone,
  answered: CheckCircle2,
  voicemails: Voicemail,
  "avg-duration": Clock3,
};

const styleById = {
  "todays-calls": "border-violet-200 bg-violet-50 text-violet-700",
  answered: "border-green-200 bg-green-50 text-green-700",
  voicemails: "border-amber-200 bg-amber-50 text-amber-700",
  "avg-duration": "border-blue-200 bg-blue-50 text-blue-700",
};

type CallMetricCardProps = {
  metric: CallMetric;
};

export function CallMetricCard({ metric }: CallMetricCardProps) {
  const Icon = iconById[metric.id as keyof typeof iconById] ?? Phone;
  const classes = styleById[metric.id as keyof typeof styleById] ?? styleById["todays-calls"];

  return (
    <article className={`rounded-lg border p-5 shadow-sm ${classes}`}>
      <div className="flex items-center gap-4">
        <Icon className="size-8 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-slate-700">{metric.label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{metric.value ?? "—"}</p>
          <p className="mt-1 text-sm text-slate-600">{metric.helperText ?? "Connected data"}</p>
        </div>
      </div>
    </article>
  );
}
