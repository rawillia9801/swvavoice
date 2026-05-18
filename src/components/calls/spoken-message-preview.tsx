import { Bot, Check, AudioLines } from "lucide-react";

type SpokenMessagePreviewProps = {
  message: string | null;
};

export function SpokenMessagePreview({ message }: SpokenMessagePreviewProps) {
  return (
    <section className="h-[308px] rounded-[13px] border border-[#eee7df] bg-white p-6 shadow-[0_16px_48px_rgba(68,58,45,0.06)]">
      <div className="flex items-center gap-3">
        <AudioLines className="size-6 text-[#6e48d7]" aria-hidden="true" />
        <h2 className="text-[14px] font-semibold text-[#5b37c9]">
          AI Greeting / Spoken Message Preview
        </h2>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ded0ff] text-[#6b42c7]">
          <Bot className="size-6" aria-hidden="true" />
        </div>
        <div className="max-w-[296px] rounded-[14px] bg-gradient-to-br from-[#f3ecfb] to-[#f6edf5] px-6 py-5 text-[16px] font-medium leading-[23px] text-[#151226] shadow-inner">
          {message ? (
            <>&ldquo;{message}&rdquo;</>
          ) : (
            <span className="text-stone-500">
              No spoken message yet. This will display the message returned by the Twilio caller
              lookup flow.
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#f5eefb] px-3 py-1 text-xs font-medium text-[#6f4cb0]">
          <Check className="size-3.5" aria-hidden="true" />
          {message ? "Personalized for recognized caller" : "Waiting for lookup response"}
        </span>
      </div>
    </section>
  );
}
