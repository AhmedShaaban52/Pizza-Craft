"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, X, Heart, Languages } from "lucide-react";
import { ModeToggle } from "../../../../components/ModeToggle";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { SearchBar } from "./SearchBar";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [cartCount, setCartCount] = useState(2);
    const [favCount, setFavCount] = useState(5);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
        { name: "Deals", href: "/deals" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white transition-colors duration-300">
            <div className="h-16 md:h-20 px-4 md:px-10">
                <div className="flex items-center justify-between h-20">

                    <Logo />

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-500 font-medium transition-colors duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Search & Action Icons */}
                    <div className="hidden md:flex items-center gap-4">
                        <SearchBar variant="desktop" />

                        <Button variant="ghost" size="icon" className="text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-500">
                            <Languages className="h-5 w-5" />
                        </Button>

                        <Button variant="ghost" size="icon" className="text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-500">
                            <User className="h-5 w-5" />
                        </Button>

                        <Button variant="ghost" size="icon" className="relative text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-500">
                            <Heart className="h-5 w-5" />
                            {favCount > 0 && (
                                <span className="absolute top-1 right-1 bg-emerald-600 text-white font-sans text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {favCount}
                                </span>
                            )}
                        </Button>

                        <Button variant="ghost" size="icon" className="relative text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-500">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-emerald-600 text-white font-sans text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </Button>

                        <ModeToggle />
                    </div>

                    {/* Mobile Menu Actions */}
                    <div className="md:hidden flex items-center gap-2">
                        <ModeToggle />

                        <Button variant="ghost" size="icon" className="text-neutral-600 dark:text-neutral-300">
                            <Languages className="h-5 w-5" />
                        </Button>

                        <Button variant="ghost" size="icon" className="relative text-neutral-600 dark:text-neutral-300">
                            <Heart className="h-5 w-5" />
                            {favCount > 0 && (
                                <span className="absolute top-1 right-1 bg-emerald-600 text-white font-sans text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {favCount}
                                </span>
                            )}
                        </Button>

                        <Button variant="ghost" size="icon" className="relative text-neutral-600 dark:text-neutral-300">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-emerald-600 text-white font-sans text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-neutral-600 dark:text-neutral-300"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>

                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-900 px-4 pt-2 pb-4 space-y-2">
                    <div className="my-3">
                        <SearchBar variant="mobile" onResultClick={() => setIsOpen(false)} />
                    </div>

                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
                    >
                        <User className="h-5 w-5" />
                        <span>My Profile</span>
                    </Link>
                </div>
            )}
        </nav>
    );
}