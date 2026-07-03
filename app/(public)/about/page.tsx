import React from 'react';
import abouBg from "@/public/aboutBg.jpg";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-stone-50 text-stone-800 dark:bg-[#0C0A09] dark:text-[#E7E5E4] antialiased transition-colors duration-300">

            {/* Section 1: Our Story (The Hearth Hero) */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    {/* Multi-theme gradient overlays */}
                    <div className="absolute inset-0 bg-linear-to-r from-stone-50 via-stone-50/90 to-transparent dark:from-[#0C0A09] dark:via-[#0C0A09]/80 z-10"></div>
                    <div className="absolute inset-0 bg-linear-to-t from-stone-50 via-transparent to-transparent dark:from-[#0C0A09] z-10"></div>
                    <div
                        className="w-full h-full bg-cover bg-center brightness-[0.75] dark:brightness-[0.4]"
                        style={{ backgroundImage: `url('${abouBg.src}')` }}
                        role="img"
                        aria-label="A masterful pizza artisan with dusted flour stretching sourdough in front of a glowing wood-fired hearth."
                    ></div>
                </div>

                {/* Content */}
                <div className="relative z-20 w-full md:w-[95%] mx-auto px-6 md:px-12 flex justify-start items-center">
                    <div className="max-w-2xl">
                        <span className="inline-block px-3 py-1 bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-semibold tracking-wider rounded-full mb-6 uppercase">
                            Est. 2014
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-stone-900 dark:text-white mb-6 tracking-tight leading-tight">
                            The Art of <br />
                            <span className="text-[#F97316] drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">the Craft</span>
                        </h1>
                        <p className="text-stone-600 dark:text-stone-400 text-lg mb-8 leading-relaxed max-w-xl">
                            At Pizza Craft, we believe that true artisanal excellence begins with time and patience. Our dedication to traditional sourdough fermentation and premium, hand-picked toppings defines every slice we serve. Its not just a meal; its a culinary heritage forged in the heat of our signature wood-fired hearth.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-6 py-3.5 bg-[#F97316] text-white dark:text-black font-semibold rounded-lg hover:bg-[#EA580C] transition-all shadow-[0_0_25px_rgba(249,115,22,0.25)]">
                                Explore Menu
                            </button>
                            <button className="px-6 py-3.5 border border-[#F97316]/40 text-[#F97316] font-semibold rounded-lg hover:bg-[#F97316]/5 transition-all">
                                View Locations
                            </button>
                        </div>
                    </div>
                </div>

                {/* Atmospheric Glow */}
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-linear-to-br from-[#F97316]/10 to-transparent blur-3xl pointer-events-none"></div>
            </section>

            {/* Section 2: Quality Ingredients (Bento-style Layout) */}
            <section className="py-24 bg-stone-100 dark:bg-[#141210] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Bento Grid */}
                    <div className="grid grid-cols-2 gap-4 relative">
                        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#F97316]/5 rounded-full blur-3xl"></div>

                        <div className="space-y-4">
                            <div className="h-64 rounded-xl overflow-hidden bg-stone-200 dark:bg-[#1C1917]">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105 brightness-95 dark:brightness-90"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZsjKk7fcscjnKb8iTHn9MdoanM0kzFzv3VbqqfJdTyYMWA7v3ySYHsWCNeRJAqu7gPmCHY5UaqU2mufEDSHwyI2FA9s1E47S9xzHovNfEVxTYlmkjUAyE6lvpZHIiEz6Nh_zPNJhR4ueMU_GRYlXoR9XVdxTjxDyy2EW4-l9TEgoAKerOiUxUQbdFNBIEidedNQ1-NLz07JORe4OLpfaIW0uXoodcSihLRSdPU9AHQZtgYehCPAnh')" }}
                                ></div>
                            </div>
                            <div className="h-48 rounded-xl overflow-hidden bg-stone-200 dark:bg-[#1C1917]">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105 brightness-95 dark:brightness-90"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9dDTmXoh7RtEJI0I9EtcYBE-__wGyw-odUoHt-gbWja7D8GZd2izJvvWaZ6W5uBXKZd4my7ZMFqB9PWuUIhluk5RqDHTXF_k7FAKdfn4pGlia4uGLh6QlhmDJD_GImV0thW9hyVLhOIQ9LV-OcXP2ekj3hDYkyYL_k-6UqHFUl9-K1JtV7GB8EF2XDkM8qMefxpZPW78aH7pVbCROZ5ueadGNkNToodYmDjmcFO3MRzqLmUXX47qe')" }}
                                ></div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-8">
                            <div className="h-48 rounded-xl overflow-hidden bg-stone-200 dark:bg-[#1C1917]">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105 brightness-95 dark:brightness-90"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDbaSZ3i3wHRRLpUuRW8YRJFWUjSyujBwluD8WexfKN50VdqqiaQmJQQPC1pUiM-xah6J_gVkjHp9hrFI1E7Q7og-BEINI1sZASHX1GLHolmgHQw2PesOMrB7zLgoEklidKp4-Ry51RYyp95Y8Rczc2py091VKBwLB3JKS1K6nyQbH7J-7M1Qdkxrkp8zKLdD0nQ-ipdvd-HgAgUGjUS5dbN98zkP03iR05_AvJvSfnr0h7yEQLpRAg')" }}
                                ></div>
                            </div>

                            {/* Organic Sourcing Card */}
                            <div className="h-64 rounded-xl overflow-hidden bg-white/80 dark:bg-[#1C1917]/60 flex items-center justify-center border border-stone-200 dark:border-stone-800 relative group shadow-xs">
                                <div className="absolute inset-0 bg-linear-to-br from-[#F97316]/5 to-transparent opacity-50"></div>
                                <div className="text-center p-6 relative z-10 flex flex-col items-center">
                                    <svg className="w-12 h-12 text-[#F97316] mb-3 opacity-90 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v15m0-15c-3.5 0-6.5 2.5-6.5 6a6.5 6.5 0 006.5 6.5m0-12.5c3.5 0 6.5 2.5 6.5 6a6.5 6.5 0 01-6.5 6.5" />
                                    </svg>
                                    <p className="text-xs font-semibold tracking-widest text-stone-600 dark:text-stone-300 uppercase">100% Organic Sourcing</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content & List */}
                    <div className="lg:pl-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-6 tracking-tight leading-tight">
                            Pure Excellence <br />
                            <span className="text-[#F97316]">Without Compromise</span>
                        </h2>
                        <p className="text-stone-600 dark:text-stone-400 text-base mb-10 leading-relaxed">
                            We dont cut corners. From the moisture content of our flour to the specific altitude where our tomatoes are grown, every detail is considered to provide the ultimate pizza experience.
                        </p>

                        <div className="space-y-8">
                            {/* Value 1 */}
                            <div className="flex gap-4 group">
                                <div className="shrink-0 w-12 h-12 rounded-lg bg-white dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white dark:group-hover:text-black transition-all duration-300 shadow-xs">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m4-2a8 8 0 11-16 0 8 8 0 0116 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-1">24-Hour Fermentation</h3>
                                    <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">Our signature sourdough rests for a full day to develop a complex flavor profile and light, airy crust.</p>
                                </div>
                            </div>

                            {/* Value 2 */}
                            <div className="flex gap-4 group">
                                <div className="shrink-0 w-12 h-12 rounded-lg bg-white dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white dark:group-hover:text-black transition-all duration-300 shadow-xs">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.625M16.5 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.5m-7.5 0h7.5m-3-12h3.375c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H13.5M9 7.5v4.5m3-4.5v4.5" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-1">Locally Sourced</h3>
                                    <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">We partner with local urban farms to ensure our produce is harvested and delivered within hours.</p>
                                </div>
                            </div>

                            {/* Value 3 */}
                            <div className="flex gap-4 group">
                                <div className="shrink-0 w-12 h-12 rounded-lg bg-white dark:bg-[#1C1917] border border-stone-200 dark:border-stone-800 flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white dark:group-hover:text-black transition-all duration-300 shadow-xs">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.15-.458.84-.458.99 0l2.4 7.392a1 1 0 00.95.69h7.762c.48 0 .678.618.29.914l-6.281 4.564a1 1 0 00-.364 1.118l2.4 7.392c.15.458-.38.843-.772.558l-6.281-4.565a1 1 0 00-1.176 0l-6.28 4.565c-.392.285-.922-.102-.772-.558l2.4-7.392a1 1 0 00-.364-1.118L2.016 12.495c-.388-.296-.19-.914.29-.914h7.763a1 1 0 00.95-.69l2.483-7.393z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-1">Artisanal Toppings</h3>
                                    <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">From hand-stretched mozzarella to house-cured meats, every topping is a masterpiece of flavor.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}