"use client";

import {
  Bot,
  CreditCard,
  Home,
  MessageSquare,
  PawPrint,
  Phone,
  Settings,
  Truck,
  User,
  Users,
  Voicemail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Calls", icon: Phone, href: "/calls" },
  { label: "Contacts", icon: User, href: "/contacts" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Voicemail", icon: Voicemail, href: "/voicemail" },
  { label: "Customers", icon: Users, href: "/customers" },
  { label: "Puppies", icon: PawPrint, href: "/puppies" },
  { label: "Pickups & Delivery", icon: Truck, href: "/pickups-delivery" },
  { label: "Payments", icon: CreditCard, href: "/payments" },
  { label: "Automation", icon: Bot, href: "/automation" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const usesDarkSidebar = pathname.startsWith("/calls") || pathname.startsWith("/contacts");

  return (
    <aside
      className={`hidden w-[318px] shrink-0 px-3 py-4 shadow-[8px_0_30px_rgba(75,63,49,0.04)] backdrop-blur xl:flex xl:flex-col ${
        usesDarkSidebar
          ? "border-r border-white/10 bg-[#171b39] text-white"
          : "border-r border-[#ebe5dc] bg-[#fbfaf7]/95"
      }`}
    >
      <div className="flex items-center gap-2.5 px-1">
        <Image
          src="/assets/brand-chihuahua.png"
          alt=""
          width={70}
          height={72}
          className="size-[70px] rounded-sm object-cover"
          priority
        />
        <div>
          <p
            className={`max-w-[190px] text-[25px] font-semibold leading-[27px] ${
              usesDarkSidebar ? "text-white" : "text-[#2a120b]"
            }`}
          >
            Southwest Virginia Chihuahua
          </p>
          <p className={`mt-1 text-[14px] ${usesDarkSidebar ? "text-white/80" : "text-[#4f4b47]"}`}>
            Smart VOIP & Customer Care
          </p>
        </div>
      </div>

      <nav className="mt-5 space-y-1.5" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex h-[48px] items-center gap-4 rounded-[7px] border px-4 text-[14px] font-medium transition ${
                active
                  ? usesDarkSidebar
                    ? "border-white/10 bg-[#6750d8] text-white shadow-sm"
                    : "border-[#a7dad7] bg-[#eefaf8] text-[#00736d] shadow-sm"
                  : usesDarkSidebar
                    ? "border-transparent text-white/82 hover:bg-white/10 hover:text-white"
                    : "border-transparent text-[#222832] hover:bg-white hover:text-stone-950"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-[19px] shrink-0" aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className={`mt-auto flex min-h-[129px] items-end gap-3 rounded-[8px] px-4 py-3 shadow-sm ${
          usesDarkSidebar
            ? "border border-white/10 bg-white/8"
            : "border border-[#e8e1d8] bg-white"
        }`}
      >
        <Image
          src="/assets/support-chihuahua.png"
          alt=""
          width={86}
          height={92}
          className="h-[92px] w-[86px] object-cover"
        />
        <div className="flex-1 pb-4">
          <p className={`text-[12px] leading-[18px] ${usesDarkSidebar ? "text-white/85" : "text-[#5f5a55]"}`}>
            Our mission is simple: Healthy puppies, happy families, lifelong support.
          </p>
        </div>
      </div>
    </aside>
  );
}
