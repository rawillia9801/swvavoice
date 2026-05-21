import { NextRequest, NextResponse } from "next/server";
import { hasAppSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await hasAppSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const recordingSid = request.nextUrl.searchParams.get("recordingSid")?.trim();
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKeySid = process.env.TWILIO_API_KEY_SID;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;

  if (!recordingSid) {
    return NextResponse.json({ error: "Recording SID is required." }, { status: 400 });
  }

  if (!accountSid || !apiKeySid || !apiKeySecret) {
    return NextResponse.json({ error: "Twilio recording access is not configured." }, { status: 503 });
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${recordingSid}.mp3`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKeySid}:${apiKeySecret}`).toString("base64")}`,
      },
    },
  );

  if (!response.ok || !response.body) {
    return NextResponse.json({ error: "Recording audio is unavailable." }, { status: response.status });
  }

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": response.headers.get("content-type") || "audio/mpeg",
      "Cache-Control": "private, max-age=300",
    },
  });
}
