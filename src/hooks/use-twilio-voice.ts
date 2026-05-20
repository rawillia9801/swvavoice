"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Call, Device } from "@twilio/voice-sdk";
import type { CallState, VoiceConnectionStatus } from "@/lib/calls/types";

type TokenResponse = {
  configured: boolean;
  identity?: string;
  token?: string;
  missing?: string[];
  error?: string;
};

function readableTwilioError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown Twilio Voice error.";
  const maybeCode =
    typeof error === "object" && error && "code" in error ? String(error.code) : "";

  if (message.includes("31005") || maybeCode === "31005") {
    return [
      "Twilio gateway closed the call connection (31005).",
      "The browser Device connected to Twilio, but the TwiML App likely did not return valid outbound-call TwiML for this request.",
      "Set the TwiML App Voice Request URL to a public URL that returns <Dial><Number>{{To}}</Number></Dial>.",
    ].join(" ");
  }

  return message;
}

export type TwilioVoiceDiagnostics = {
  sdkLoaded: boolean;
  deviceInitialized: boolean;
  accessTokenPresent: boolean;
  deviceStatus: VoiceConnectionStatus;
  callState: CallState;
  lastError: string | null;
  identity: string | null;
  missing: string[];
  activeCallPresent: boolean;
  muted: boolean;
  held: boolean;
};

export function useTwilioVoice() {
  const [status, setStatus] = useState<VoiceConnectionStatus>("uninitialized");
  const [callState, setCallState] = useState<CallState>("idle");
  const [identity, setIdentity] = useState<string | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [accessTokenPresent, setAccessTokenPresent] = useState(false);
  const [deviceInitialized, setDeviceInitialized] = useState(false);
  const [activeCallPresent, setActiveCallPresent] = useState(false);
  const [muted, setMuted] = useState(false);
  const [held, setHeld] = useState(false);
  const [activeNumber, setActiveNumber] = useState<string | null>(null);
  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<Call | null>(null);

  const attachCallHandlers = useCallback((call: Call, number?: string) => {
    let accepted = false;
    callRef.current = call;
    setActiveCallPresent(true);
    setActiveNumber(number || null);
    setCallState("dialing");
    setMuted(false);

    call.on("accept", () => {
      accepted = true;
      setCallState("active");
    });
    call.on("disconnect", () => {
      callRef.current = null;
      setActiveCallPresent(false);
      if (!accepted) {
        setLastError(
          "Browser Voice call ended before the destination rang. This usually means the TwiML App Voice Request URL is missing, unreachable, or not returning valid <Dial><Number> TwiML. Use the REST test button to verify Twilio can ring the number, then check the TwiML App URL.",
        );
      }
      setCallState("ended");
      setMuted(false);
      setHeld(false);
    });
    call.on("cancel", () => {
      callRef.current = null;
      setActiveCallPresent(false);
      setCallState("ended");
      setMuted(false);
    });
    call.on("reject", () => {
      callRef.current = null;
      setActiveCallPresent(false);
      setCallState("ended");
      setMuted(false);
    });
    call.on("error", (error) => {
      callRef.current = null;
      setActiveCallPresent(false);
      setLastError(readableTwilioError(error));
      setCallState("failed");
    });
  }, []);

  const initialize = useCallback(async () => {
    if (deviceRef.current && status === "ready") {
      return;
    }

    setStatus("loading");
    setLastError(null);
    setMissing([]);

    try {
      const response = await fetch("/api/twilio/voice-token", { cache: "no-store" });
      const payload = (await response.json()) as TokenResponse;

      if (!response.ok || !payload.configured || !payload.token) {
        setAccessTokenPresent(false);
        setMissing(payload.missing || []);
        setLastError(payload.error || "Twilio Voice is not fully configured.");
        setStatus("error");
        return;
      }

      setAccessTokenPresent(true);
      setIdentity(payload.identity || null);

      const device = new Device(payload.token, { logLevel: 1 });
      deviceRef.current = device;
      setDeviceInitialized(true);

      device.on("registered", () => setStatus("ready"));
      device.on("unregistered", () => setStatus("offline"));
      device.on("error", (error) => {
        setLastError(readableTwilioError(error));
        setStatus("error");
      });
      device.on("incoming", (call) => {
        attachCallHandlers(call);
        setCallState("ringing");
      });

      await device.register();
      setStatus("ready");
    } catch (error) {
      setAccessTokenPresent(false);
      setLastError(readableTwilioError(error));
      setStatus("error");
    }
  }, [attachCallHandlers, status]);

  const startOutboundCall = useCallback(
    async (phoneNumber: string) => {
      const trimmed = phoneNumber.trim();

      if (!trimmed) {
        setLastError("Enter a phone number before placing a call.");
        setCallState("failed");
        return false;
      }

      if (!deviceRef.current || status !== "ready") {
        setLastError(
          "Twilio Voice is not fully configured yet. A valid access token and Voice SDK device are required to place calls.",
        );
        setCallState("failed");
        return false;
      }

      try {
        setLastError(null);
        setCallState("dialing");
        const call = await deviceRef.current.connect({
          params: {
            To: trimmed,
          },
        });
        attachCallHandlers(call, trimmed);
        setCallState("ringing");
        return true;
      } catch (error) {
        setLastError(readableTwilioError(error));
        setCallState("failed");
        return false;
      }
    },
    [attachCallHandlers, status],
  );

  const toggleMute = useCallback(() => {
    if (!callRef.current) {
      setLastError("No active call.");
      return;
    }

    const nextMuted = !muted;
    callRef.current.mute(nextMuted);
    setMuted(nextMuted);
    setCallState(nextMuted ? "muted" : "active");
  }, [muted]);

  const toggleHold = useCallback(() => {
    setHeld((current) => !current);
    setLastError("Hold is not connected to Twilio yet.");
  }, []);

  const endCall = useCallback(() => {
    if (!callRef.current) {
      setLastError("No active call.");
      return;
    }

    callRef.current.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      callRef.current?.disconnect();
      deviceRef.current?.destroy();
    };
  }, []);

  const diagnostics: TwilioVoiceDiagnostics = useMemo(
    () => ({
      sdkLoaded: Boolean(Device),
      deviceInitialized,
      accessTokenPresent,
      deviceStatus: status,
      callState,
      lastError,
      identity,
      missing,
      activeCallPresent,
      muted,
      held,
    }),
    [
      accessTokenPresent,
      activeCallPresent,
      callState,
      deviceInitialized,
      held,
      identity,
      lastError,
      missing,
      muted,
      status,
    ],
  );

  return {
    diagnostics,
    initialize,
    startOutboundCall,
    toggleMute,
    toggleHold,
    endCall,
    activeNumber,
  };
}
