"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import comboPic from "@/public/comboPic.jpg";

const COUNTDOWN_DURATION = 4 * 60 * 60; 

function formatTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
        .map((unit) => String(unit).padStart(2, "0"))
        .join(":");
}

export default function SpecialsSection() {
    const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_DURATION);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => (prev <= 1 ? COUNTDOWN_DURATION : prev - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="px-4 md:px-16 py-16">
            <div className="relative rounded-2xl bg-white dark:bg-[#141210] text-stone-800 dark:text-[#E7E5E4] overflow-hidden p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-stone-200 dark:border-stone-800 transition-colors duration-300 shadow-xs">

                <div className="flex-1 space-y-6 relative z-10 w-full">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-[#F97316] rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold tracking-widest text-[#F97316] uppercase">TODAY'S SPECIAL</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-white leading-tight">
                        The "Craft" Combo <br />
                        <span className="text-[#F97316] drop-shadow-[0_0_15px_rgba(249,115,22,0.2)]">Only $29.99</span>
                    </h2>

                    <p className="text-stone-600 dark:text-stone-400 text-lg max-w-lg leading-relaxed">
                        Get our bestseller 'The Craft' pizza, a side of Garlic Herb Knots, and two artisanal lemonades. Save 25% today only.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <button className="bg-[#F97316] text-white dark:text-black font-semibold px-8 py-4 rounded-lg hover:bg-[#EA580C] hover:scale-105 transition-all shadow-md active:scale-98">
                            ORDER NOW
                        </button>

                        <div className="flex items-center gap-2 px-5 py-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-stone-100 dark:bg-[#1C1917]/80 text-stone-900 dark:text-white text-sm font-medium">
                            <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m4-2a8 8 0 11-16 0 8 8 0 0116 0z" />
                            </svg>
                            <span className="tabular-nums">Ends in {formatTime(secondsLeft)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative h-64 md:h-96 w-full group flex items-center justify-center">
                    <div className="relative w-full h-full transform rotate-3 group-hover:rotate-0 transition-transform duration-500 rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800">
                        <Image
                            src={comboPic}
                            alt="Craft combo meal"
                            fill
                            className="object-contain bg-center brightness-95 dark:brightness-90"
                        />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#F97316]/10 dark:bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none"></div>
                </div>

            </div>
        </section>
    );
}