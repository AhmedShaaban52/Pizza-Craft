"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

interface SessionUser {
    name: string;
    email: string;
    image?: string | null;
}

export function UserMenu() {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let ignore = false;

        authClient.getSession().then((result) => {
            if (!ignore) {
                setUser(result.data?.user ?? null);
                setLoading(false);
            }
        });

        return () => {
            ignore = true;
        };
    }, []);

    async function handleSignOut() {
        await authClient.signOut();
        setUser(null);
        setOpen(false);
        router.push("/");
        router.refresh();
    }

    if (loading) {
        return (
            <div className="h-5 w-5 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        );
    }

    if (!user) {
        return (
            <Link
                href="/login"
                className="text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 cursor-pointer"
            >
                <User className="h-5 w-5" />
            </Link>
        );
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 cursor-pointer"
            >
                {user.image ? (
                    <Image
                        src={user.image}
                        alt={user.name}
                        width={28}
                        height={28}
                        unoptimized
                        className="h-7 w-7 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-7 w-7 rounded-full bg-orange-500 text-black flex items-center justify-center text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                )}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />

                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-lg overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-900">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                {user.email}
                            </p>
                        </div>

                        <Link
                            href="/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
                        >
                            <User className="h-4 w-4" />
                            My Profile
                        </Link>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}