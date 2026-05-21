import { SectionPageShell } from "@/components/layout/section-page-shell";
import { requireAppSession } from "@/lib/auth";

export default async function PickupsDeliveryPage() {
  await requireAppSession();

  return (
    <SectionPageShell
      title="Pickups & Delivery"
      subtitle="Coordinate pickup windows, delivery questions, and travel follow-up."
    />
  );
}
