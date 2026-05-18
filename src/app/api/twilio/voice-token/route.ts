import { NextResponse } from "next/server";
import twilio from "twilio";
import { hasAppSession } from "@/lib/auth";
import {
  getTwilioVoiceConfigStatus,
  getTwilioVoiceIdentity,
} from "@/lib/twilio-config";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await hasAppSession())) {
    return NextResponse.json(
      {
        configured: false,
        error: "Unauthorized.",
      },
      { status: 401 },
    );
  }

  const status = getTwilioVoiceConfigStatus();

  if (!status.configured) {
    return NextResponse.json(
      {
        configured: false,
        error: "Twilio Voice is not configured.",
        missing: status.missing,
      },
      { status: 503 },
    );
  }

  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_API_KEY_SID!,
    process.env.TWILIO_API_KEY_SECRET!,
    {
      identity: getTwilioVoiceIdentity(),
      ttl: 3600,
    },
  );

  token.addGrant(
    new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID!,
      incomingAllow: true,
    }),
  );

  return NextResponse.json({
    configured: true,
    identity: getTwilioVoiceIdentity(),
    token: token.toJwt(),
  });
}
