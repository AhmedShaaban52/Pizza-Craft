"use client";

import Link from 'next/link';
import { NAV_ITEMS } from '@/data/data';
import { usePathname } from 'next/navigation';
import { pickLocale, useLocale } from '@/context/locale-context';


const MobileTabs = () => {
    const { locale } = useLocale();
    const pathname = usePathname()
    return (
        <nav className="md:hidden w-full p-4 border-b border-border bg-background mt-20">
            <div className="grid grid-cols-2 gap-4">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                    const active = href === "/profile"
                        ? pathname === href
                        : pathname?.startsWith(href + "/");

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium shadow-sm transition-all border ${active ? "bg-orange-500 text-white border-orange-600 shadow-md" : "bg-card text-muted-foreground border-border hover:bg-muted"}`}
                        >
                            <Icon className={`w-4 h-4 ${active ? "text-white" : "text-muted-foreground"}`} />
                            <span className="truncate">
                                {pickLocale(label.en, label.ar, locale)}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    )
}

export default MobileTabs