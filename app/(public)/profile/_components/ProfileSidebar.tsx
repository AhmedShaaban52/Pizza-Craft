"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ClipboardList, Heart, ShoppingBasket } from "lucide-react";

const NAV_ITEMS = [
    { label: "Profile", href: "/profile", icon: User },
    { label: "My Orders", href: "/profile/orders", icon: ClipboardList },
    { label: "Wishlist", href: "/profile/favorites", icon: Heart },
    { label: "My Cart", href: "/profile/cart", icon: ShoppingBasket },
];

export function ProfileSidebar() {
    const pathname = usePathname();
    return (
        <aside className="w-52 shrink-0 border-r border-border bg-card py-6 px-3 flex flex-col gap-1">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                        ${active
                                ? "bg-orange-500/15 text-orange-500"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <Icon className={`w-4 h-4 shrink-0 ${active ? "text-orange-500" : ""}`} />
                        {label}
                    </Link>
                );
            })}
        </aside>
    );
}