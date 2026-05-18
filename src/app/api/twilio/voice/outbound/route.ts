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

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const to = String(formData.get("To") || "").trim();
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
