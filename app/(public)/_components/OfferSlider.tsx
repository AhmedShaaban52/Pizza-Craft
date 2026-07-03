"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { Offer } from "@/lib/types";

interface OfferSliderProps {
    offers: Offer[];
}

export default function OfferSlider({ offers }: OfferSliderProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        duration: 35,
        align: "center",
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    const onInit = useCallback(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
    }, [emblaApi]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        setScrollSnaps(emblaApi.scrollSnapList());
        setSelectedIndex(emblaApi.selectedScrollSnap());

        emblaApi.on("init", onInit);
        emblaApi.on("reInit", onInit);
        emblaApi.on("select", onSelect);

        return () => {
            emblaApi.off("init", onInit);
            emblaApi.off("reInit", onInit);
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect, onInit]);

    if (!offers || offers.length === 0) return null;

    return (
        <div className="relative w-full bg-neutral-50 dark:bg-neutral-950 py-14 overflow-hidden transition-colors duration-300">

            <div className="overflow-visible max-w-5xl md:max-w-6xl mx-auto px-4" ref={emblaRef}>
                <div className="flex gap-6 md:gap-8 perspective-1000">
                    {offers.map((offer, index) => {
                        const isActive = index === selectedIndex;
                        const discountText = offer.discount ? `${offer.discount}% OFF` : "SPECIAL OFFER";
                        const badgeText = offer.discount ? `Special ${offer.discount}% Offer` : "Limited Time";

                        return (
                            <div
                                key={offer.id}
                                className="relative min-w-[85%] md:min-w-[75%] lg:min-w-[70%] shrink-0 transition-all duration-500 ease-out preserve-3d select-none"
                                style={{
                                    transform: isActive ? "scale(1)" : "scale(0.9)",
                                    opacity: isActive ? 1 : 0.35,
                                    zIndex: isActive ? 10 : 1,
                                }}
                            >
                                <div className="relative w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-8 md:p-10 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-[0_20px_50px_rgba(249,115,22,0.08)] dark:shadow-[0_0_50px_rgba(249,115,22,0.15)] overflow-hidden transition-all duration-300">
                                    <div
                                        className="pointer-events-none absolute inset-0 hidden dark:block opacity-30"
                                        style={{
                                            background: "radial-gradient(circle 350px at 75% 50%, rgba(16,185,129,0.15), transparent 80%)",
                                        }}
                                    />

                                    <div className="relative z-10 space-y-4 text-left order-2 md:order-1">
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                                            <Plus className="h-3 w-3 stroke-3" />
                                            {badgeText}
                                        </div>

                                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-none">
                                            {discountText}
                                            <span className="block text-orange-600 dark:text-orange-500 font-serif font-bold italic mt-2">
                                                {offer.name}
                                            </span>
                                        </h2>

                                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm">
                                            {offer.description || "Indulge in our classic premium selections fresh from the stone oven."}
                                        </p>

                                        <div className="pt-2 flex items-center gap-3">
                                            <Button
                                                asChild
                                                disabled={!isActive}
                                                className="bg-orange-500 hover:bg-orange-400 text-white dark:text-black font-bold rounded-full px-6 py-5 text-xs transition-all shadow-[0_4px_15px_rgba(249,115,22,0.2)] dark:shadow-[0_4px_20px_rgba(249,115,22,0.3)] group/btn"
                                            >
                                                <Link href="/products" className="flex items-center gap-1.5">
                                                    Order Now
                                                    <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                                                </Link>
                                            </Button>

                                            <Button
                                                asChild
                                                variant="outline"
                                                disabled={!isActive}
                                                className="rounded-full px-6 py-5 text-xs font-semibold border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 bg-transparent transition-all"
                                            >
                                                <Link href="/menu">Explore Menu</Link>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex justify-center md:justify-end order-1 md:order-2">
                                        <div className="relative w-47.5 sm:w-57.5 md:w-67.5 lg:w-75 aspect-square rounded-2xl overflow-hidden shadow-md dark:shadow-[0_0_30px_rgba(249,115,22,0.08)] ring-1 ring-neutral-100 dark:ring-orange-500/10">
                                            <Image
                                                src={offer.image}
                                                alt={offer.name}
                                                fill
                                                unoptimized
                                                priority
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 300px"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={scrollPrev}
                    aria-label="Previous slide"
                    className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center transition-all hover:bg-orange-500 dark:hover:bg-orange-500 text-neutral-800 dark:text-white hover:text-white dark:hover:text-black shadow-sm cursor-pointer"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-2">
                    {scrollSnaps.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollTo(i)}
                            className={`transition-all duration-300 rounded-full h-1.5 ${i === selectedIndex ? "w-6 bg-orange-500" : "w-1.5 bg-neutral-300 dark:bg-neutral-800"
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={scrollNext}
                    aria-label="Next slide"
                    className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center transition-all hover:bg-orange-500 dark:hover:bg-orange-500 text-neutral-800 dark:text-white hover:text-white dark:hover:text-black shadow-sm cursor-pointer"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

        </div>
    );
}