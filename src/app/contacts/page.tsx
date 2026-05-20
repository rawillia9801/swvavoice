import { requireAppSession } from "@/lib/auth";
import { ContactsWorkspace } from "@/components/contacts/contacts-workspace";
import { getContacts } from "@/lib/contacts/get-contacts";

export default async function ContactsPage() {
  await requireAppSession();

  const contacts = await getContacts();

  return <ContactsWorkspace initialContacts={contacts} />;
}
