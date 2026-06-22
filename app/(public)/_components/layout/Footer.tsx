import Link from "next/link";
import { Globe, Rss, Share2 } from "lucide-react";
import Logo from "./Logo";

const quickLinks = [
    { name: "Menu Selection", href: "/products" },
    { name: "Active Deals", href: "/deals" },
    { name: "Our Story", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Gift Cards", href: "/gift-cards" },
];

const customerService = [
    { name: "Track Order", href: "/orders" },
    { name: "Return Policy", href: "/returns" },
    { name: "Support Center", href: "/support" },
    { name: "Allergy Info", href: "/allergy-info" },
    { name: "Locations", href: "/locations" },
];

export default function Footer() {
    return (
        <footer className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <div className="px-4 md:px-14 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand column */}
                    <div>
                        <Logo />
                        <p className="mt-4 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-xs">
                            Elevating the pizza experience through artisanal mastery and the
                            finest seasonal ingredients. Pure craft in every bite.
                        </p>

                        <div className="mt-5 flex items-center gap-3">
                            <SocialIcon icon={<Globe className="h-4 w-4" />} label="Website" />
                            <SocialIcon icon={<Rss className="h-4 w-4" />} label="RSS feed" />
                            <SocialIcon icon={<Share2 className="h-4 w-4" />} label="Share" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
                            Customer Service
                        </h3>
                        <ul className="space-y-3">
                            {customerService.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
                            Newsletter
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                            Join our circle for exclusive seasonal drops.
                        </p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-semibold text-sm py-2.5 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-neutral-200 dark:border-neutral-900 px-4 md:px-14 py-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        &copy; {new Date().getFullYear()} PizzaCraft Artisanal Kitchen. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/privacy"
                            className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/accessibility"
                            className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                            Accessibility
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <a
            href="#"
            aria-label={label}
            className="h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-orange-500 hover:text-black dark:hover:bg-orange-500 dark:hover:text-black flex items-center justify-center transition-colors"
        >
            {icon}
        </a >
    );
}