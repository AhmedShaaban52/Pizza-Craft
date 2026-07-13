"use client";

import { NAV_ITEMS } from "@/data/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileTabs from "./MobileTabs";
import { pickLocale, useLocale } from "@/context/locale-context";


export function ProfileSidebar() {
  const { locale } = useLocale();
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden md:flex w-52 shrink-0 pt-28 border-r border-border bg-card px-3 flex-col gap-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = href === "/profile" ? pathname === href : pathname?.startsWith(href + "/");
          return (
            <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-orange-500/15 text-orange-500" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon className="w-4 h-4" />
              {pickLocale(label.en, label.ar, locale)}
            </Link>
          );
        })}
      </aside>

      <MobileTabs />
    </>
  );
}