import { Bell, ChevronDown, CircleHelp, PhoneCall } from "lucide-react";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-[78px] items-center justify-between border-b border-[#eee7df] bg-[#fffefa]/90 px-4 backdrop-blur lg:px-5">
      <div className="flex items-center gap-3 xl:hidden">
        <div className="grid size-10 place-items-center rounded-full bg-teal-50 text-teal-700">
          <PhoneCall className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-950">Southwest Virginia Chihuahua</p>
          <p className="text-xs text-stone-500">Smart VOIP & Customer Care</p>
        </div>
      </div>

      <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
        <div className="flex h-[40px] items-center gap-3 rounded-full border border-[#dbeed6] bg-[#edf8e9] px-5 text-[14px] font-semibold text-[#16713b] shadow-sm">
          <PhoneCall className="size-4" aria-hidden="true" />
          <span>Ready for Calls</span>
          <span className="font-mono font-medium text-stone-800">--:--</span>
        </div>
        <div className="h-8 w-px bg-stone-200" />
        <div className="flex items-center gap-2 text-sm font-semibold text-[#e3212b]">
          <span className="grid size-8 place-items-center rounded-full border-2 border-[#e3212b] text-[14px]">
            tw
          </span>
          <span className="text-[10px] uppercase tracking-wide text-stone-400">Powered by</span>
          <span className="text-2xl lowercase tracking-tight">twilio</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          className="relative grid size-10 place-items-center rounded-full border border-transparent bg-transparent text-stone-600"
          aria-label="Notifications"
        >
          <Bell className="size-5" aria-hidden="true" />
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-amber-400 text-[11px] font-bold text-white">
            3
          </span>
        </button>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-transparent bg-transparent text-stone-600"
          aria-label="Help"
        >
          <CircleHelp className="size-5" aria-hidden="true" />
        </button>
        <div className="hidden items-center gap-3 border-l border-stone-200 pl-4 sm:flex">
          <div className="relative grid size-[42px] place-items-center rounded-full bg-gradient-to-br from-teal-50 to-amber-50 text-sm font-bold text-teal-800">
            AD
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-green-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-950">Admin</p>
            <p className="text-xs text-stone-500">Admin</p>
          </div>
          <ChevronDown className="size-4 text-stone-500" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
