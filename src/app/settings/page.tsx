import { SectionPageShell } from "@/components/layout/section-page-shell";
import { requireAppSession } from "@/lib/auth";

export default async function SettingsPage() {
  await requireAppSession();

  return (
    <SectionPageShell
      title="Settings"
      subtitle="Manage app configuration, Twilio status, Supabase data, and dashboard preferences."
    />
  );
}
