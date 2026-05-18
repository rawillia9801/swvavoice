"use client";

import {
  Grip,
  Mic,
  Pause,
  PhoneForwarded,
  PhoneOff,
  UserPlus,
  Wifi,
} from "lucide-react";

const controls = [
  { label: "Mute", icon: Mic },
  { label: "Hold", icon: Pause },
  { label: "Keypad", icon: Grip },
  { label: "Transfer", icon: PhoneForwarded },
  { label: "Add Call", icon: UserPlus },
];

type CallControlBarProps = {
  hasActiveCall?: boolean;
  muted?: boolean;
  held?: boolean;
  onMute?: () => void;
  onHold?: () => void;
  onKeypad?: () => void;
  onTransfer?: () => void;
  onAddCall?: () => void;
  onEndCall?: () => void;
};

export function CallControlBar({
  hasActiveCall = false,
  muted = false,
  held = false,
  onMute,
  onHold,
  onKeypad,
  onTransfer,
  onAddCall,
  onEndCall,
}: CallControlBarProps) {
  const handlers: Record<string, (() => void) | undefined> = {
    Mute: onMute,
    Hold: onHold,
    Keypad: onKeypad,
    Transfer: onTransfer,
    "Add Call": onAddCall,
  };

  return (
    <div className="sticky bottom-0 z-30 border-t border-[#eee7df] bg-[#fffefa]/90 px-4 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-[1320px] items-center gap-5">
        <div className="hidden h-[52px] min-w-[216px] items-center gap-2 rounded-[10px] border border-stone-200 bg-white px-4 text-[12px] shadow-sm md:flex">
          <Wifi className="size-4 text-green-600" aria-hidden="true" />
          <span className="font-medium text-stone-700">Good Connection</span>
          <span className="ml-auto text-xs text-stone-500">HD Voice</span>
        </div>
        <div className="flex h-[56px] flex-1 items-center justify-center gap-5 rounded-[10px] border border-stone-200 bg-white px-4 py-1 shadow-sm">
          {controls.map((control) => {
            const Icon = control.icon;

            return (
              <button
                key={control.label}
                type="button"
                onClick={handlers[control.label]}
                disabled={["Mute", "Hold"].includes(control.label) && !hasActiveCall}
                className="grid min-w-16 place-items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-50"
              >
                <Icon className="size-5 text-stone-700" aria-hidden="true" />
                {control.label === "Mute" && muted
                  ? "Muted"
                  : control.label === "Hold" && held
                    ? "Held"
                    : control.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={onEndCall}
            disabled={!hasActiveCall}
            className="ml-1 grid size-14 place-items-center rounded-full bg-red-500 text-white shadow-lg shadow-red-200 transition hover:bg-red-600"
            aria-label="End Call"
          >
            <PhoneOff className="size-5" aria-hidden="true" />
            <span className="sr-only">End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
}
