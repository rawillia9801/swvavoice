import { NextRequest, NextResponse } from "next/server";
import { hasAppSession } from "@/lib/auth";
import { getTwilioRestClient } from "@/lib/twilio/server-client";

export const dynamic = "force-dynamic";

function cleanPhoneNumber(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export async function POST(request: NextRequest) {
  if (!(await hasAppSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const client = getTwilioRestClient();
  const callerId = process.env.TWILIO_CALLER_ID?.trim();
  const body = (await request.json().catch(() => ({}))) as { to?: string };
  const to = cleanPhoneNumber(body.to || "");

  if (!client || !callerId) {
    return NextResponse.json(
      {
        error:
          "Twilio REST calling is not configured. TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, and TWILIO_CALLER_ID are required.",
      },
      { status: 503 },
    );
  }

  if (!to) {
    return NextResponse.json({ error: "Enter a phone number to call." }, { status: 400 });
  }

  try {
    const call = await client.calls.create({
      to,
      from: callerId,
      twiml:
        "<Response><Say voice=\"alice\">This is a Southwest Virginia Chihuahua voice system test call.</Say></Response>",
    });

    return NextResponse.json({
      ok: true,
      callSid: call.sid,
      status: call.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to place Twilio test call.",
      },
      { status: 500 },
    );
  }
}
