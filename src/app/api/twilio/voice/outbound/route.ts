import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export const dynamic = "force-dynamic";

function twimlResponse(response: InstanceType<typeof twilio.twiml.VoiceResponse>) {
  return new NextResponse(response.toString(), {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
  });
}

function cleanDialNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return value.trim().startsWith("+") ? `+${digits}` : digits;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const to = cleanDialNumber(String(formData.get("To") || ""));
  const callerId = process.env.TWILIO_CALLER_ID?.trim();
  const response = new twilio.twiml.VoiceResponse();

  if (!to) {
    response.say("No phone number was provided.");
    response.hangup();
    return twimlResponse(response);
  }

  const dial = response.dial({
    ...(callerId ? { callerId } : {}),
  });

  dial.number(to);

  return twimlResponse(response);
}
