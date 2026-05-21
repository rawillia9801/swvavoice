import { SectionPageShell } from "@/components/layout/section-page-shell";
import { requireAppSession } from "@/lib/auth";

export default async function PaymentsPage() {
  await requireAppSession();

  return (
    <SectionPageShell
      title="Payments"
      subtitle="Review balances, deposits, puppy payment info, and payment follow-up."
    />
  );
}
