"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, pickLocale } from "@/context/locale-context";

interface CategoryCardProps {
    id: string;
    name: string;
    nameAr?: string | null;
    description: string | null;
    descriptionAr?: string | null;
    image: string;
}

export default function CategoryCard({ id, name, nameAr, description, descriptionAr, image }: CategoryCardProps) {
    const { locale } = useLocale();
    const localizedName = pickLocale(name, nameAr, locale);
    const localizedDescription = pickLocale(description, descriptionAr, locale);

    return (
        <Link
            href={`/products?category=${id}`}
            className="group/category relative rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/15 dark:hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)] flex flex-col overflow-hidden cursor-pointer"
        >
            <div className="relative aspect-4/3 w-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <Image
                    src={image}
                    alt={localizedName}
                    fill
                    unoptimized
                    priority
                    className="object-cover transition-transform duration-700 ease-out group-hover/category:scale-105"
                />
            </div>

            <div className="p-5 flex flex-col grow text-start">
                <h3 className="text-md sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight transition-colors duration-300 group-hover/category:text-orange-500">
                    {localizedName}
                </h3>

                {localizedDescription && (
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {localizedDescription}
                    </p>
                )}
            </div>
        </Link>
    );
}