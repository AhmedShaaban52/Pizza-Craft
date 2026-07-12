"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Product } from "@/lib/types";
import BestSellerCard from "../products/_components/BestSellerCard";

interface BestSellerSectionProps {
    products: Product[];
}

export default function BestSellerSection({ products }: BestSellerSectionProps) {
    const t = useTranslations("BestSellers");

    if (!products || products.length === 0) return null;

    const displayedProducts = products.slice(0, 4);

    return (
        <div className="w-full bg-neutral-50 dark:bg-neutral-950 py-12 transition-colors duration-300">
            <div className="px-4 md:px-14">
                <div className="flex items-end justify-between mb-8">
                    <div className="space-y-1 text-start">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
                            {t("title")}
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                            {t("subtitle")}
                        </p>
                    </div>

                    <div className="flex gap-2.5 rtl:flex-row-reverse">
                        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white active:scale-95 cursor-pointer">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white active:scale-95 cursor-pointer">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayedProducts.map((product) => (
                        <BestSellerCard key={product.id} product={product as Product} />
                    ))}
                </div>
            </div>
        </div>
    );
}