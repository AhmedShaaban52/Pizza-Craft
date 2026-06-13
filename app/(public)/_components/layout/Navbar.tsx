"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X,  Heart, Languages } from "lucide-react";
import { ModeToggle } from "../../../../components/ModeToggle"; // Make sure the path to your file is correct
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [cartCount, setCartCount] = useState(2);
    const [favCount, setFavCount] = useState(5); // Example favorites state

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Menu", href: "/menu" },
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
                        {/* Search Bar */}
                        <div className="relative mr-2">
                            <input
                                type="text"
                                placeholder="Search pizzas..."
                                className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full py-1.5 pl-10 pr-4 text-sm text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-44 transition-all duration-300"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                        </div>

                        {/* Translation Icon */}
                        <Button variant="ghost" size="icon" className="text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-500">
                            <Languages className="h-5 w-5" />
                        </Button>

                        {/* Account Icon */}
                        <Button variant="ghost" size="icon" className="text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-500">
                            <User className="h-5 w-5" />
                        </Button>

                        {/* Favorites Icon (FavCart) */}
                        <Button variant="ghost" size="icon" className="relative text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-500">
                            <Heart className="h-5 w-5" />
                            {favCount > 0 && (
                                <span className="absolute top-1 right-1 bg-emerald-600 text-white font-sans text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {favCount}
                                </span>
                            )}
                        </Button>

                        {/* Cart Icon */}
                        <Button variant="ghost" size="icon" className="relative text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-500">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-emerald-600 text-white font-sans text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </Button>

                        {/* Custom Mode Toggle Component */}
                        <ModeToggle />
                    </div>

                    {/* Mobile Menu Actions */}
                    <div className="md:hidden flex items-center gap-2">
                        <ModeToggle />

                        {/* Mobile Translation Shortcut */}
                        <Button variant="ghost" size="icon" className="text-neutral-600 dark:text-neutral-300">
                            <Languages className="h-5 w-5" />
                        </Button>

                        {/* Mobile Favorites Shortcut */}
                        <Button variant="ghost" size="icon" className="relative text-neutral-600 dark:text-neutral-300">
                            <Heart className="h-5 w-5" />
                            {favCount > 0 && (
                                <span className="absolute top-1 right-1 bg-emerald-600 text-white font-sans text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {favCount}
                                </span>
                            )}
                        </Button>

                        {/* Mobile Cart */}
                        <Button variant="ghost" size="icon" className="relative text-neutral-600 dark:text-neutral-300">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-emerald-600 text-white font-sans text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Button>

                        {/* Hamburger Toggle */}
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
                    <div className="relative my-3">
                        <input
                            type="text"
                            placeholder="Search pizzas..."
                            className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm text-neutral-800 dark:text-neutral-200"
                        />
                        <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
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