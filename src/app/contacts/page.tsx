import { requireAppSession } from "@/lib/auth";
import { ContactsWorkspace } from "@/components/contacts/contacts-workspace";
import { sampleContacts } from "@/lib/contacts/sample-contacts";

export default async function ContactsPage() {
  await requireAppSession();

  return <ContactsWorkspace initialContacts={sampleContacts} />;
}
