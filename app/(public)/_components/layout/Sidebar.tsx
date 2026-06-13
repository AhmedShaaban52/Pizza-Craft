"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ChevronDown } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { links } from "@/data/data";


export function Sidebar() {
    const pathname = usePathname();
    const [openMenu, setOpenMenu] = useState<string | null>(
        links.find((l) => l.subItems?.some((s) => s.href === pathname))?.name ?? null
    );

    return (
        <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col justify-between h-screen sticky top-0 transition-colors duration-200 z-30">
            <div>
                <div className="px-6 py-6">
                    <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        FreshDelight
                    </h1>
                </div>

                <nav className="flex flex-col gap-1 px-3">
                    {links.map((link) => {
                        const Icon = link.icon;

                        if (link.subItems) {
                            const isOpen = openMenu === link.name;
                            const hasActiveChild = link.subItems.some((s) => s.href === pathname);

                            return (
                                <div key={link.name}>
                                    <button
                                        onClick={() => setOpenMenu(isOpen ? null : link.name)}
                                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-colors ${hasActiveChild
                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                            : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                                            }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            {link.name}
                                        </span>
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    {isOpen && (
                                        <div className="ml-7 mt-1 flex flex-col gap-1">
                                            {link.subItems.map((sub) => {
                                                const isActive = pathname === sub.href;
                                                return (
                                                    <Link
                                                        key={sub.href}
                                                        href={sub.href}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium tracking-wide transition-colors ${isActive
                                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                                            : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                                                            }`}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // Regular item with href
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href!}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-colors ${isActive
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                    : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-3 px-3 py-3">
                    <div className="h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                        <User className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold leading-none">Admin User</p>
                        <p className="text-xs text-neutral-400 mt-0.5">Super Admin</p>
                    </div>
                </div>

                <ModeToggle />
            </div>
        </aside>
    );
}