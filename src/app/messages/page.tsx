import { MessagesWorkspace } from "@/components/messages/messages-workspace";
import { requireAppSession } from "@/lib/auth";
import { getConversations, getMessageStats } from "@/lib/messages/get-conversations";

export default async function MessagesPage() {
  await requireAppSession();

  const conversations = await getConversations();
  const stats = getMessageStats(conversations);

  return <MessagesWorkspace initialConversations={conversations} initialStats={stats} />;
}
