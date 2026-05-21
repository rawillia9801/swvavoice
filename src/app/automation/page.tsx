import { SectionPageShell } from "@/components/layout/section-page-shell";
import { requireAppSession } from "@/lib/auth";

export default async function AutomationPage() {
  await requireAppSession();

  return (
    <SectionPageShell
      title="Automation"
      subtitle="Monitor caller lookup, menu routing, follow-up, and customer-care automations."
    />
  );
}
