"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Menu, X, Globe } from "lucide-react";
import { ModeToggle } from "../../../../components/ModeToggle";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "./Logo";
import { SearchBar } from "./SearchBar";
import { CartFavCount } from "./CartFavCount";
import { UserMenu } from "./UserMenu";
import { pickLocale, useLocale } from "@/context/locale-context";
import { NavLinks } from "@/data/data";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { locale, setLocale } = useLocale();

    function toggleLocale() {
        setLocale(locale === "en" ? "ar" : "en");
    }

    return (
        <nav className="fixed top-0 z-50 w-full bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white transition-colors duration-300">
            <div className="h-16 lg:h-20 px-4 lg:px-10">
                <div className="flex items-center justify-between h-full">

                    <Logo />

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {NavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition-colors duration-200 whitespace-nowrap"
                            >
                                {pickLocale(link.name.en, link.name.ar, locale)}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Search & Action Icons */}
                    <div className="hidden lg:flex items-center gap-4">
                        <SearchBar variant="desktop" />

                        <Button
                            variant="ghost"
                            className="relative px-3 gap-2 text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors cursor-pointer"
                            onClick={toggleLocale}
                        >
                            <Globe className="h-5 w-5" />
                            <span className="absolute bottom-2.5 left-5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-orange-600 text-[9px] font-bold text-white shadow-sm">
                                {locale === "en" ? "AR" : "EN"}
                            </span>
                        </Button>

                        <UserMenu />

                        <CartFavCount variant="desktop" />

                        <ModeToggle />
                    </div>

                    <div className="lg:hidden flex items-center gap-1.5">
                        <ModeToggle />

                        <Button
                            variant="ghost"
                            className="relative px-3 gap-2 text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors cursor-pointer"
                            onClick={toggleLocale}
                        >
                            <Globe className="h-5 w-5" />
                            <span className="absolute bottom-2.5 left-5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-orange-600 text-[9px] font-bold text-white shadow-sm">
                                {locale === "en" ? "AR" : "EN"}
                            </span>
                        </Button>

                        <CartFavCount variant="mobile" />

                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-neutral-600 dark:text-neutral-300"
                                >
                                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="left" className="w-72 p-0 gap-0">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                                <SheetHeader className="border-b border-neutral-200 dark:border-neutral-800 py-4">
                                    <Logo />
                                </SheetHeader>

                                <div className="flex flex-col gap-1 px-4 py-4 overflow-y-auto">
                                    <SearchBar
                                        variant="mobile"
                                        onResultClick={() => setIsOpen(false)}
                                    />

                                    <div className="mt-3 flex flex-col gap-1">
                                        {NavLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className="block px-3 py-2.5 rounded-lg text-base font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                                            >
                                                {pickLocale(link.name.en, link.name.ar, locale)}
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="my-3 border-t border-neutral-200 dark:border-neutral-800" />

                                    <Link
                                        href="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                                    >
                                        <User className="h-5 w-5" />
                                        <span>My Profile</span>
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                </div>
            </div>
        </nav>
    );
}