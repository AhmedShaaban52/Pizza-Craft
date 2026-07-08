"use client";

import { useLocale, pickLocale } from "@/lib/locale-context";

interface ProductLocalizedInfoProps {
    name: string;
    nameAr?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
}

export function ProductLocalizedInfo({
    name,
    nameAr,
    description,
    descriptionAr,
}: ProductLocalizedInfoProps) {
    const { locale, dir } = useLocale();
    const localizedName = pickLocale(name, nameAr, locale);
    const localizedDescription = pickLocale(description, descriptionAr, locale);

    return (
        <div dir={dir}>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                {localizedName}
            </h1>

            {localizedDescription && (
                <p className="mt-3 text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {localizedDescription}
                </p>
            )}
        </div>
    );
}