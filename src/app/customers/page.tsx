import { SectionPageShell } from "@/components/layout/section-page-shell";
import { requireAppSession } from "@/lib/auth";

export default async function CustomersPage() {
  await requireAppSession();

  return (
    <SectionPageShell
      title="Customers"
      subtitle="Manage families, leads, reservations, and customer-care follow-up."
    />
  );
}
