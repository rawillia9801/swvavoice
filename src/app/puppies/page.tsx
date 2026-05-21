import { SectionPageShell } from "@/components/layout/section-page-shell";
import { requireAppSession } from "@/lib/auth";

export default async function PuppiesPage() {
  await requireAppSession();

  return (
    <SectionPageShell
      title="Puppies"
      subtitle="Track puppy availability, interest, reservations, and customer matches."
    />
  );
}
