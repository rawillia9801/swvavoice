export type TwilioVoiceConfigStatus = {
  configured: boolean;
  missing: string[];
};

const requiredServerEnv = [
  "TWILIO_ACCOUNT_SID",
  "TWILIO_API_KEY_SID",
  "TWILIO_API_KEY_SECRET",
  "TWILIO_TWIML_APP_SID",
] as const;

export function getTwilioVoiceConfigStatus(): TwilioVoiceConfigStatus {
  const missing = requiredServerEnv.filter((key) => !process.env[key]);

  return {
    configured: missing.length === 0,
    missing,
  };
}

export function getTwilioVoiceIdentity() {
  return process.env.TWILIO_VOICE_IDENTITY || "swva-dashboard";
}
