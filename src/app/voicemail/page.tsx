import { VoicemailWorkspace } from "@/components/voicemail/voicemail-workspace";
import { requireAppSession } from "@/lib/auth";
import {
  getMailboxSummary,
  getVoicemails,
  getVoicemailStats,
} from "@/lib/voicemail/get-voicemails";

export default async function VoicemailPage() {
  await requireAppSession();
  const voicemails = await getVoicemails();
  const stats = getVoicemailStats(voicemails);
  const mailbox = getMailboxSummary(voicemails);

  return <VoicemailWorkspace initialVoicemails={voicemails} stats={stats} mailbox={mailbox} />;
}
