import "server-only";

import twilio from "twilio";

export function getTwilioRestClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKeySid = process.env.TWILIO_API_KEY_SID;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;

  if (!accountSid || !apiKeySid || !apiKeySecret) {
    return null;
  }

  return twilio(apiKeySid, apiKeySecret, {
    accountSid,
  });
}
