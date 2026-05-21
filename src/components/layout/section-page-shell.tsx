import { CallControlBar } from "@/components/calls/call-control-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";

type SectionPageShellProps = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};

export function SectionPageShell({ title, subtitle, children }: SectionPageShellProps) {
  return (
    <main className="min-h-screen bg-[#f7f4ef] text-stone-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader />
          <div className="flex-1 px-7 py-7 pb-28">
            <div className="mx-auto max-w-[1120px]">
              <h1 className="text-3xl font-bold tracking-tight text-stone-950">{title}</h1>
              <p className="mt-2 text-sm text-stone-600">{subtitle}</p>
              <section className="mt-8 rounded-xl border border-[#eee7df] bg-white p-6 shadow-sm">
                {children || (
                  <div className="rounded-lg border border-dashed border-stone-200 bg-stone-50/70 p-6">
                    <p className="text-base font-semibold text-stone-900">{title} workspace</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      This section is routed and ready for real Twilio, Supabase, and Zoho data wiring.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>
          <CallControlBar />
        </div>
      </div>
    </main>
  );
}
