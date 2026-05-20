"use client";

import { useMemo, useState } from "react";
import { CallAnalyticsCard } from "@/components/calls/call-analytics-card";
import { CallMetricCard } from "@/components/calls/call-metric-card";
import { CallControlBar } from "@/components/calls/call-control-bar";
import { CallsQuickActionsCard } from "@/components/calls/calls-quick-actions-card";
import { CallsTable } from "@/components/calls/calls-table";
import { CallsTopHeader } from "@/components/calls/calls-top-header";
import { DialpadModal } from "@/components/calls/dialpad-modal";
import { LiveCallCard } from "@/components/calls/live-call-card";
import { QuickActionModal } from "@/components/calls/quick-action-modal";
import { TwilioVoicePanel } from "@/components/calls/twilio-voice-panel";
import { Sidebar } from "@/components/layout/sidebar";
import { useTwilioVoice } from "@/hooks/use-twilio-voice";
import type {
  CallAnalytics,
  CallMetric,
  CallRecord,
  CallsQuickAction,
  CallsTab,
  LiveCall,
} from "@/lib/calls/types";

type CallsWorkspaceProps = {
  calls: CallRecord[];
  liveCall: LiveCall | null;
  analytics: CallAnalytics;
  metrics: CallMetric[];
  actions: CallsQuickAction[];
};

export function CallsWorkspace({
  calls,
  liveCall,
  analytics,
  metrics,
  actions,
}: CallsWorkspaceProps) {
  const voice = useTwilioVoice();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<CallsTab>("All Calls");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dialpadOpen, setDialpadOpen] = useState(false);
  const [dialNumber, setDialNumber] = useState("");
  const [dialMessage, setDialMessage] = useState<string | null>(null);
  const [quickAction, setQuickAction] = useState<CallsQuickAction | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const filteredCalls = useMemo(() => {
    const query = search.trim().toLowerCase();

    return calls.filter((call) => {
      const matchesSearch =
        !query ||
        call.callerName?.toLowerCase().includes(query) ||
        call.phone.toLowerCase().includes(query) ||
        call.notes?.toLowerCase().includes(query);
      const matchesTab =
        activeTab === "All Calls" ||
        (activeTab === "Inbound" && call.direction === "inbound") ||
        (activeTab === "Outbound" && call.direction === "outbound") ||
        (activeTab === "Missed" && call.status === "missed") ||
        (activeTab === "Voicemails" && call.status === "voicemail");

      return matchesSearch && matchesTab;
    });
  }, [activeTab, calls, search]);

  const callFromDialpad = async () => {
    setDialMessage(null);
    const attempted = await voice.startOutboundCall(dialNumber);

    if (!attempted) {
      setDialMessage(voice.diagnostics.lastError || "Unable to place call.");
      return;
    }

    setDialMessage("Outbound call attempted through Twilio Voice.");
  };

  const callFromServer = async () => {
    setDialMessage(null);

    try {
      const response = await fetch("/api/twilio/calls/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: dialNumber }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        callSid?: string;
        status?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        setDialMessage(payload.error || "Twilio REST test call failed.");
        return;
      }

      setDialMessage(
        `Twilio REST test call created. Status: ${payload.status || "queued"}. SID: ${payload.callSid}`,
      );
    } catch (error) {
      setDialMessage(error instanceof Error ? error.message : "Twilio REST test call failed.");
    }
  };

  const showNotConnected = (message: string) => {
    setNotice(message);
  };

  const saveCallNote = async (note: string) => {
    const noteTarget = liveCall || filteredCalls[0] || null;
    const response = await fetch("/api/call-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: note,
        callId: noteTarget?.id || null,
        phone: noteTarget?.phone || null,
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      throw new Error(payload.error || "Note could not be saved.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <CallsTopHeader searchValue={search} onSearchChange={setSearch} />
          <div className="flex-1 px-7 py-7 pb-6">
            <div className="mx-auto grid max-w-[1280px] gap-6 xl:grid-cols-[1fr_254px]">
              <section className="min-w-0">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950">Calls</h1>
                  <p className="mt-2 text-sm text-slate-600">
                    Manage, monitor, and review all incoming and outgoing calls.
                  </p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {metrics.map((metric) => (
                    <CallMetricCard key={metric.id} metric={metric} />
                  ))}
                </div>

                <CallsTable
                  calls={filteredCalls}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  filtersOpen={filtersOpen}
                  onToggleFilters={() => setFiltersOpen((current) => !current)}
                />
              </section>

              <aside className="space-y-5">
                <LiveCallCard
                  liveCall={liveCall}
                  diagnostics={voice.diagnostics}
                  activeNumber={voice.activeNumber}
                  onMute={voice.toggleMute}
                  onHold={voice.toggleHold}
                  onOpenKeypad={() => setDialpadOpen(true)}
                  onEnd={voice.endCall}
                />
                <TwilioVoicePanel
                  diagnostics={voice.diagnostics}
                  onInitialize={voice.initialize}
                />
                <CallsQuickActionsCard actions={actions} onAction={setQuickAction} />
                <CallAnalyticsCard analytics={analytics} />
              </aside>
            </div>
          </div>
          <CallControlBar
            hasActiveCall={voice.diagnostics.activeCallPresent}
            muted={voice.diagnostics.muted}
            held={voice.diagnostics.held}
            onMute={voice.toggleMute}
            onHold={voice.toggleHold}
            onKeypad={() => setDialpadOpen(true)}
            onTransfer={() => showNotConnected("Transfer is not connected yet.")}
            onAddCall={() => setDialpadOpen(true)}
            onEndCall={voice.endCall}
          />
        </div>
      </div>

      <DialpadModal
        open={dialpadOpen}
        value={dialNumber}
        onChange={setDialNumber}
        onClose={() => setDialpadOpen(false)}
        onCall={callFromDialpad}
        onServerTestCall={callFromServer}
        calling={["dialing", "ringing"].includes(voice.diagnostics.callState)}
        message={dialMessage || voice.diagnostics.lastError}
      />
      <QuickActionModal
        action={quickAction}
        onClose={() => setQuickAction(null)}
        onSaveNote={saveCallNote}
      />
      {notice ? (
        <div className="fixed bottom-24 right-6 z-50 max-w-sm rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice(null)} className="text-amber-900">
              Close
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
