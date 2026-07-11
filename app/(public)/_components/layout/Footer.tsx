"use client";

import Link from "next/link";
import { Globe, Rss, Share2 } from "lucide-react";
import Logo from "./Logo";
import { useLocale } from "@/context/locale-context";

export default function Footer() {
    const { locale } = useLocale();

    const t = {
        brandDesc: locale === "ar"
            ? "نرتقي بتجربة البيتزا من خلال الإتقان الحرفي واستخدام أجود المكونات الموسمية. حرفية خالصة في كل قضمة."
            : "Elevating the pizza experience through artisanal mastery and the finest seasonal ingredients. Pure craft in every bite.",
        quickLinksTitle: locale === "ar" ? "روابط سريعة" : "Quick Links",
        links: {
            menu: locale === "ar" ? "قائمة الطعام" : "Menu Selection",
            deals: locale === "ar" ? "العروض الحالية" : "Active Deals",
            story: locale === "ar" ? "قصتنا" : "Our Story",
            careers: locale === "ar" ? "الوظائف" : "Careers",
            gifts: locale === "ar" ? "بطاقات الهدايا" : "Gift Cards",
        },
        serviceTitle: locale === "ar" ? "خدمة العملاء" : "Customer Service",
        service: {
            track: locale === "ar" ? "تتبع الطلب" : "Track Order",
            returns: locale === "ar" ? "سياسة الإرجاع" : "Return Policy",
            support: locale === "ar" ? "مركز الدعم" : "Support Center",
            allergy: locale === "ar" ? "معلومات الحساسية" : "Allergy Info",
            locations: locale === "ar" ? "الفروع" : "Locations",
        },
        newsletter: {
            title: locale === "ar" ? "النشرة البريدية" : "Newsletter",
            desc: locale === "ar" ? "انضم إلينا للحصول على عروض حصرية موسمية." : "Join our circle for exclusive seasonal drops.",
            placeholder: locale === "ar" ? "عنوان البريد الإلكتروني" : "Email address",
            button: locale === "ar" ? "اشتراك" : "Subscribe",
        },
        footerBottom: {
            copyright: locale === "ar" ? "جميع الحقوق محفوظة لـ PizzaCraft Artisanal Kitchen." : "PizzaCraft Artisanal Kitchen. All rights reserved.",
            privacy: locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
            terms: locale === "ar" ? "شروط الخدمة" : "Terms of Service",
            accessibility: locale === "ar" ? "إمكانية الوصول" : "Accessibility",
        }
    };

    return (
        <footer className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-200 text-start">
            <div className="px-4 md:px-14 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div>
                        <Logo />
                        <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-xs">
                            {t.brandDesc}
                        </p>
                        <div className="mt-5 flex items-center gap-3">
                            <SocialIcon icon={<Globe className="h-4 w-4" />} label="Website" />
                            <SocialIcon icon={<Rss className="h-4 w-4" />} label="RSS feed" />
                            <SocialIcon icon={<Share2 className="h-4 w-4" />} label="Share" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">{t.quickLinksTitle}</h3>
                        <ul className="space-y-3">
                            {Object.entries(t.links).map(([key, name]) => (
                                <li key={key}>
                                    <Link href={`/${key === 'menu' ? 'products' : key}`} className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                        {name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">{t.serviceTitle}</h3>
                        <ul className="space-y-3">
                            {Object.entries(t.service).map(([key, name]) => (
                                <li key={key}>
                                    <Link href={`/${key}`} className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                        {name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">{t.newsletter.title}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{t.newsletter.desc}</p>
                        <form className="space-y-3">
                            <input type="email" placeholder={t.newsletter.placeholder} className="w-full rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-orange-500" />
                            <button type="submit" className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-2.5 transition-colors">{t.newsletter.button}</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-900 px-4 md:px-14 py-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        &copy; {new Date().getFullYear()} {t.footerBottom.copyright}
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-xs text-neutral-500 hover:text-orange-600">{t.footerBottom.privacy}</Link>
                        <Link href="/terms" className="text-xs text-neutral-500 hover:text-orange-600">{t.footerBottom.terms}</Link>
                        <Link href="/accessibility" className="text-xs text-neutral-500 hover:text-orange-600">{t.footerBottom.accessibility}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <a href="#" aria-label={label} className="h-9 w-9 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors">
            {icon}
        </a>
    );
}