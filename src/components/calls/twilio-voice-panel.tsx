"use client";

import { PhoneCall, WifiOff } from "lucide-react";
import { useTwilioVoice, type TwilioVoiceDiagnostics } from "@/hooks/use-twilio-voice";

type TwilioVoicePanelProps = {
  diagnostics?: TwilioVoiceDiagnostics;
  onInitialize?: () => void;
};

export function TwilioVoicePanel({ diagnostics: externalDiagnostics, onInitialize }: TwilioVoicePanelProps) {
  const internalVoice = useTwilioVoice();
  const diagnostics = externalDiagnostics ?? internalVoice.diagnostics;
  const initializeVoice = onInitialize ?? internalVoice.initialize;
  const ready = diagnostics.deviceStatus === "ready";
  const callFailed = diagnostics.callState === "failed";

  const statusText = ready
    ? callFailed
      ? `Device ready${diagnostics.identity ? ` as ${diagnostics.identity}` : ""}. Last call failed.`
      : `Device ready${diagnostics.identity ? ` as ${diagnostics.identity}` : ""}.`
    : diagnostics.deviceStatus === "loading"
      ? "Requesting secure Twilio access token..."
      : diagnostics.lastError || "Twilio Voice SDK installed. Initialize to verify the real connection.";

  return (
    <section className="rounded-[10px] border border-[#eee7df] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {ready ? (
            <PhoneCall className="size-4 text-green-600" aria-hidden="true" />
          ) : (
            <WifiOff className="size-4 text-stone-500" aria-hidden="true" />
          )}
          <h2 className="text-xs font-bold uppercase tracking-wide text-stone-700">
            Twilio Voice
          </h2>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            ready
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {ready ? "Ready" : "Setup"}
        </span>
      </div>

      <p className="mt-3 text-sm leading-5 text-stone-600">{statusText}</p>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <dt className="text-stone-500">Voice SDK loaded</dt>
        <dd className="font-semibold text-stone-800">{diagnostics.sdkLoaded ? "Yes" : "No"}</dd>
        <dt className="text-stone-500">Device initialized</dt>
        <dd className="font-semibold text-stone-800">
          {diagnostics.deviceInitialized ? "Yes" : "No"}
        </dd>
        <dt className="text-stone-500">Access token</dt>
        <dd className="font-semibold text-stone-800">
          {diagnostics.accessTokenPresent ? "Present" : "Missing"}
        </dd>
        <dt className="text-stone-500">Device connection</dt>
        <dd className="font-semibold text-stone-800">{diagnostics.deviceStatus}</dd>
        <dt className="text-stone-500">Last call state</dt>
        <dd className={`font-semibold ${callFailed ? "text-red-700" : "text-stone-800"}`}>
          {diagnostics.callState}
        </dd>
      </dl>

      {diagnostics.lastError ? (
        <div className="mt-3 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs leading-5 text-red-800">
          {diagnostics.lastError}
        </div>
      ) : null}

      {diagnostics.missing.length > 0 ? (
        <ul className="mt-3 space-y-1 text-xs text-stone-500">
          {diagnostics.missing.map((key) => (
            <li key={key}>
              Missing <span className="font-mono text-stone-700">{key}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        onClick={initializeVoice}
        disabled={diagnostics.deviceStatus === "loading" || ready}
        className="mt-4 w-full rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {diagnostics.deviceStatus === "loading" ? "Connecting..." : ready ? "Connected" : "Initialize Voice"}
      </button>
    </section>
  );
}
