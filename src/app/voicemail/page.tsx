import { SectionPageShell } from "@/components/layout/section-page-shell";
import { requireAppSession } from "@/lib/auth";

export default async function VoicemailPage() {
  await requireAppSession();

  return (
    <SectionPageShell
      title="Voicemail"
      subtitle="Review caller voicemails and attach follow-up notes."
    />
  );
}
