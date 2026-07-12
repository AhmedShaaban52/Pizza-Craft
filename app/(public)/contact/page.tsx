import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
    const t = await getTranslations("Contact");

    return (
        <main className="relative min-h-screen md:pt-5 bg-stone-50 text-stone-800 dark:bg-[#0C0A09] dark:text-[#E7E5E4] antialiased transition-colors duration-300">

            <section className="relative pt-24 pb-16 px-6 md:px-12 overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="max-w-2xl">
                        <span className="inline-block px-3 py-1 bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-semibold tracking-wider rounded-full mb-6 uppercase">
                            {t("connect")}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white mb-4 tracking-tight">
                            {t("getInTouch")}
                        </h1>
                        <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
                            {t("heroDescription")}
                        </p>
                    </div>
                </div>
                <div className="absolute right-0 top-0 w-1/2 h-full bg-linear-to-bl from-[#F97316]/10 to-transparent blur-3xl pointer-events-none"></div>
            </section>

            <section className="px-6 md:px-12 pb-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-7">
                        <div className="bg-white/80 dark:bg-[#141210]/60 p-6 md:p-8 rounded-xl border border-stone-200 dark:border-stone-800 backdrop-blur-md shadow-xs">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-stone-700 dark:text-orange-500">{t("nameLabel")}</label>
                                        <input className="w-full mt-2 bg-stone-100 dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-2.5 text-stone-900 dark:text-white focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600" placeholder={t("namePlaceholder")} type="text" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-stone-700 dark:text-orange-500">{t("emailLabel")}</label>
                                        <input className="w-full mt-2 bg-stone-100 dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-2.5 text-stone-900 dark:text-white focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600" placeholder={t("emailPlaceholder")} type="email" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700 dark:text-orange-500">{t("subjectLabel")}</label>
                                    <div className="relative">
                                        <select className="w-full mt-2 bg-stone-100 dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-2.5 text-stone-900 dark:text-white focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all appearance-none cursor-pointer">
                                            <option>{t("option1")}</option>
                                            <option>{t("option2")}</option>
                                            <option>{t("option3")}</option>
                                            <option>{t("option4")}</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500 dark:text-stone-400">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700 dark:text-orange-500">{t("messageLabel")}</label>
                                    <textarea className="w-full mt-2 bg-stone-100 dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-2.5 text-stone-900 dark:text-white focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all resize-none placeholder:text-stone-400 dark:placeholder:text-stone-600" placeholder={t("messagePlaceholder")} rows={6}></textarea>
                                </div>
                                <button className="w-full md:w-auto px-8 py-3.5 bg-[#F97316] text-white dark:text-white font-semibold rounded-lg hover:bg-[#EA580C] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all active:scale-[0.98]" type="submit">
                                    {t("submitButton")}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="bg-stone-100 dark:bg-[#141210] p-6 md:p-8 rounded-xl border border-stone-200 dark:border-stone-800/60 shadow-xs">
                            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-6">{t("flagshipTitle")}</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <svg className="w-5 h-5 text-[#F97316] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <div>
                                        <p className="font-semibold text-stone-900 dark:text-white">{t("address1")}</p>
                                        <p className="text-stone-600 dark:text-stone-400 text-sm">{t("address2")}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <svg className="w-5 h-5 text-[#F97316] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <div>
                                        <p className="font-semibold text-stone-900 dark:text-white">{t("phone")}</p>
                                        <p className="text-stone-600 dark:text-stone-400 text-sm">{t("hours")}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <svg className="w-5 h-5 text-[#F97316] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <div>
                                        <p className="font-semibold text-stone-900 dark:text-white">{t("emailContact")}</p>
                                        <p className="text-stone-600 dark:text-stone-400 text-sm">{t("supportTime")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-75 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800/60 group cursor-pointer relative">
                            <div className="absolute inset-0 bg-stone-900/40 dark:bg-black/50 group-hover:bg-stone-900/30 dark:group-hover:bg-black/30 transition-colors z-10 flex items-center justify-center">
                                <div className="px-5 py-2.5 bg-white/90 dark:bg-[#1C1917]/90 text-stone-900 dark:text-white rounded-full flex items-center gap-2 border border-stone-200 dark:border-stone-800 backdrop-blur-xs text-sm font-medium shadow-md">
                                    <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{t("mapButton")}</span>
                                </div>
                            </div>
                            <div className="w-full h-full bg-cover bg-center grayscale contrast-110 dark:contrast-125 brightness-100 dark:brightness-75 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBz0QoAkFgG-LRg9QoXr7BdACIeXkQzuG8S96Z9GeYoXjWD7Pk5Ywfr9Ykcvm2fFPrsZIhjdaJmhypo9203AqawY7en8cJXyzEOIlLKPz-Q0MYomnX-CaLnuMUkZcyzPdk_bos2LAX778xCzCqEaHNg2_zqbKjgb_1WMgdTLZxVq7-_nyz4xoRg2VWnTr6TzYOqUv8MjbtBRe9O8HXJJoD6KS41ae106m8lVQNQqHTLIxbjdyzluuNZ')" }}></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-stone-100 dark:bg-[#141210]/40 py-16 px-6 md:px-12 border-t border-stone-200 dark:border-stone-800/60 transition-colors duration-300">
                <div className="max-w-7xl mx-auto text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white mb-2">{t("faqTitle")}</h2>
                    <p className="text-stone-600 dark:text-stone-400">{t("faqDesc")}</p>
                </div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a className="p-6 rounded-xl bg-white dark:bg-[#1C1917]/40 hover:bg-stone-50 dark:hover:bg-[#1C1917] border border-stone-200 dark:border-stone-800 transition-all group shadow-2xs" href="#">
                        <svg className="w-6 h-6 text-[#F97316] mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                        <h4 className="font-semibold text-stone-900 dark:text-white mb-2 group-hover:text-[#F97316] transition-colors">{t("deliveryTitle")}</h4>
                        <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{t("deliveryDesc")}</p>
                    </a>
                    <a className="p-6 rounded-xl bg-white dark:bg-[#1C1917]/40 hover:bg-stone-50 dark:hover:bg-[#1C1917] border border-stone-200 dark:border-stone-800 transition-all group shadow-2xs" href="#">
                        <svg className="w-6 h-6 text-[#F97316] mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        <h4 className="font-semibold text-stone-900 dark:text-white mb-2 group-hover:text-[#F97316] transition-colors">{t("cateringTitle")}</h4>
                        <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{t("cateringDesc")}</p>
                    </a>
                    <a className="p-6 rounded-xl bg-white dark:bg-[#1C1917]/40 hover:bg-stone-50 dark:hover:bg-[#1C1917] border border-stone-200 dark:border-stone-800 transition-all group shadow-2xs" href="#">
                        <svg className="w-6 h-6 text-[#F97316] mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        <h4 className="font-semibold text-stone-900 dark:text-white mb-2 group-hover:text-[#F97316] transition-colors">{t("trackingTitle")}</h4>
                        <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{t("trackingDesc")}</p>
                    </a>
                </div>
            </section>
        </main>
    );
}