"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Menu, X, Languages } from "lucide-react";
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

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white transition-colors duration-300">
            <div className="h-16 md:h-20 px-4 md:px-10">
                <div className="flex items-center justify-between h-full">

                    <Logo />

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition-colors duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Search & Action Icons */}
                    <div className="hidden md:flex items-center gap-4">
                        <SearchBar variant="desktop" />

                        <Button variant="ghost" size="icon" className="text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 cursor-pointer">
                            <Languages className="h-5 w-5" />
                        </Button>

                        <UserMenu />

                        <CartFavCount variant="desktop" />

                        <ModeToggle />
                    </div>

                    {/* Mobile Menu Actions */}
                    <div className="md:hidden flex items-center gap-1.5">
                        <ModeToggle />

                        <Button variant="ghost" size="icon" className="text-neutral-600 dark:text-neutral-300">
                            <Languages className="h-5 w-5" />
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
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className="block px-3 py-2.5 rounded-lg text-base font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                                            >
                                                {link.name}
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