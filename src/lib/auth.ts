import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const sessionCookieName = "swva_voice_session";

const dashboardPassword = process.env.SWVA_DASHBOARD_PASSWORD || "Today2020";
const sessionValue = "authenticated";

export async function hasAppSession() {
  const cookieStore = await cookies();
  return cookieStore.get(sessionCookieName)?.value === sessionValue;
}

export async function requireAppSession() {
  if (!(await hasAppSession())) {
    redirect("/login");
  }
}

export function isValidDashboardPassword(password: string) {
  return password === dashboardPassword;
}

export function getSessionCookieValue() {
  return sessionValue;
}
