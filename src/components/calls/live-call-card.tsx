import { Grid3X3, Mic, Pause, PhoneOff } from "lucide-react";
import type { LiveCall } from "@/lib/calls/types";
import type { TwilioVoiceDiagnostics } from "@/hooks/use-twilio-voice";

type LiveCallCardProps = {
  liveCall: LiveCall | null;
  diagnostics?: TwilioVoiceDiagnostics;
  activeNumber?: string | null;
  onMute?: () => void;
  onHold?: () => void;
  onOpenKeypad?: () => void;
  onEnd?: () => void;
};

export function LiveCallCard({
  liveCall,
  diagnostics,
  activeNumber,
  onMute,
  onHold,
  onOpenKeypad,
  onEnd,
}: LiveCallCardProps) {
  const hasActiveCall = Boolean(liveCall || diagnostics?.activeCallPresent);
  const liveCallTitle =
    liveCall?.callerName || (liveCall?.phone ? "Active Twilio call" : "Outbound test call");
  const liveCallDetail = liveCall?.phone || activeNumber || "Twilio Voice call in progress";

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
        <h2 className="text-base font-semibold text-slate-950">Live Call</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {hasActiveCall ? "Active" : "Idle"}
        </span>
      </div>

      <div className="p-4">
        {hasActiveCall ? (
          <div className="rounded-md border border-green-100 bg-green-50 p-4">
            <h3 className="font-semibold text-slate-950">{liveCallTitle}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{liveCallDetail}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-green-700">
              {diagnostics?.activeCallPresent ? diagnostics.callState : "active in Twilio"}
            </p>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-950">No active call</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Live call details will appear here when a call is in progress.
            </p>
          </div>
        )}

        <div className="mt-5 grid grid-cols-4 gap-3">
          {[
            { label: "Mute", icon: Mic, onClick: onMute, needsCall: true },
            { label: "Hold", icon: Pause, onClick: onHold, needsCall: true },
            { label: "Keypad", icon: Grid3X3, onClick: onOpenKeypad, needsCall: false },
            { label: "End", icon: PhoneOff, onClick: onEnd, danger: true, needsCall: true },
          ].map((control) => {
            const Icon = control.icon;

            return (
              <button
                key={control.label}
                type="button"
                onClick={control.onClick}
                disabled={control.needsCall && !hasActiveCall}
                className={`grid h-12 place-items-center rounded-full border text-sm transition disabled:cursor-not-allowed disabled:opacity-45 ${
                  control.danger
                    ? "border-red-200 bg-red-500 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
                title={!liveCall ? "No active call to control" : control.label}
              >
                <Icon className="size-4" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
