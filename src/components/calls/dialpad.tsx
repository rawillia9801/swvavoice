"use client";

import { Delete } from "lucide-react";

const keys = [
  ["1", ""],
  ["2", "ABC"],
  ["3", "DEF"],
  ["4", "GHI"],
  ["5", "JKL"],
  ["6", "MNO"],
  ["7", "PQRS"],
  ["8", "TUV"],
  ["9", "WXYZ"],
  ["*", ""],
  ["0", "+"],
  ["#", ""],
];

type DialpadProps = {
  value: string;
  onChange: (value: string) => void;
  onCall: () => void;
  calling: boolean;
  message?: string | null;
};

function cleanDialString(value: string) {
  return value.replace(/[^\d+*#]/g, "");
}

export function Dialpad({ value, onChange, onCall, calling, message }: DialpadProps) {
  const append = (digit: string) => onChange(cleanDialString(`${value}${digit}`));

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700" htmlFor="dialpad-number">
        Phone number
      </label>
      <input
        id="dialpad-number"
        value={value}
        onChange={(event) => onChange(cleanDialString(event.target.value))}
        inputMode="tel"
        autoComplete="tel"
        className="mt-2 h-12 w-full rounded-md border border-slate-200 px-4 text-center font-mono text-xl outline-none focus:border-violet-400"
        placeholder="+1"
      />

      <div className="mt-4 grid grid-cols-3 gap-3">
        {keys.map(([digit, letters]) => (
          <button
            key={digit}
            type="button"
            onClick={() => append(digit)}
            className="h-14 rounded-lg border border-slate-200 bg-white text-center shadow-sm transition hover:bg-slate-50"
          >
            <span className="block text-lg font-bold text-slate-950">{digit}</span>
            <span className="block text-[10px] font-semibold tracking-wide text-slate-400">
              {letters}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange("")}
          className="h-10 flex-1 rounded-md border border-slate-200 text-sm font-semibold text-slate-700"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => onChange(value.slice(0, -1))}
          className="grid h-10 w-12 place-items-center rounded-md border border-slate-200 text-slate-700"
          aria-label="Backspace"
        >
          <Delete className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onCall}
          disabled={calling || !value.trim()}
          className="h-10 flex-1 rounded-md bg-green-600 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {calling ? "Calling..." : "Call"}
        </button>
      </div>

      {message ? (
        <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p>
      ) : null}
    </div>
  );
}
