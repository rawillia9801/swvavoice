import { QuickActions } from "@/components/actions/quick-actions";
import { ActiveCallCard } from "@/components/calls/active-call-card";
import { CallControlBar } from "@/components/calls/call-control-bar";
import { CallNotes } from "@/components/calls/call-notes";
import { CallTimeline } from "@/components/calls/call-timeline";
import { RecentCalls } from "@/components/calls/recent-calls";
import { RecognizedCallerMenu } from "@/components/calls/recognized-caller-menu";
import { SpokenMessagePreview } from "@/components/calls/spoken-message-preview";
import { TwilioVoicePanel } from "@/components/calls/twilio-voice-panel";
import { ZohoRecordSnapshot } from "@/components/crm/zoho-record-snapshot";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { MessageTemplates } from "@/components/messages/message-templates";
import { VoicemailInbox } from "@/components/voicemail/voicemail-inbox";
import {
  activeCaller,
  callNotes,
  callTimeline,
  messageTemplates,
  publicCallerMenu,
  quickActions,
  recognizedCallerMenu,
  recentCalls,
  spokenMessage,
  voicemails,
  zohoLeadSnapshot,
} from "@/lib/dashboard-data";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] text-stone-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader />
          <div className="flex-1 px-4 py-3 pb-4 lg:px-4">
            <div className="mx-auto grid max-w-[1320px] gap-4 2xl:grid-cols-[924px_384px]">
              <div className="min-w-0 space-y-2">
                <div className="grid gap-4 lg:grid-cols-[460px_1fr]">
                  <ActiveCallCard caller={activeCaller} />
                  <SpokenMessagePreview message={spokenMessage} />
                </div>
                <RecognizedCallerMenu
                  options={recognizedCallerMenu}
                  publicOptions={publicCallerMenu}
                />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <RecentCalls calls={recentCalls} />
                  <VoicemailInbox voicemails={voicemails} />
                  <MessageTemplates templates={messageTemplates} />
                  <CallNotes notes={callNotes} />
                </div>
              </div>

              <aside className="space-y-4">
                <ZohoRecordSnapshot record={zohoLeadSnapshot} />
                <CallTimeline events={callTimeline} />
                <TwilioVoicePanel />
                <QuickActions actions={quickActions} />
              </aside>
            </div>
          </div>
          <CallControlBar />
        </div>
      </div>
    </main>
  );
}
