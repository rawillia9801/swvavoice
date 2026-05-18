import type { CallerRecognitionStatus } from "@/lib/calls/types";

type RecognitionBadgeProps = {
  status: CallerRecognitionStatus;
};

const recognitionLabel: Record<CallerRecognitionStatus, string> = {
  recognized: "Recognized Caller",
  new: "New Caller",
  no_match: "No CRM Match",
  unknown: "Unknown",
};

export function RecognitionBadge({ status }: RecognitionBadgeProps) {
  return (
    <span className="text-xs font-semibold text-slate-500">{recognitionLabel[status]}</span>
  );
}
