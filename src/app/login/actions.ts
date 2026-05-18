"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getSessionCookieValue,
  isValidDashboardPassword,
  sessionCookieName,
} from "@/lib/auth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") || "");

  if (!isValidDashboardPassword(password)) {
    redirect("/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, getSessionCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect("/dashboard");
}
