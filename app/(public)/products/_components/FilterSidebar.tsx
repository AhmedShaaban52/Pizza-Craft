"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Category } from "@/lib/types";
import { Search, X } from "lucide-react";
import { useLocale, pickLocale } from "@/context/locale-context";

interface FilterSidebarProps {
    categories: Category[];
    selectedCategories: string[];
    toggleCategory: (id: string) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    maxPrice: number;
    onlyDiscounted: boolean;
    setOnlyDiscounted: (value: boolean) => void;
    hasActiveFilters: boolean;
    clearFilters: () => void;
}

export function FilterSidebar({
    categories,
    selectedCategories,
    toggleCategory,
    priceRange,
    setPriceRange,
    maxPrice,
    onlyDiscounted,
    setOnlyDiscounted,
    hasActiveFilters,
    clearFilters,
}: FilterSidebarProps) {
    const router = useRouter();
    const { locale } = useLocale();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = searchValue.trim();
        if (trimmed) {
            router.push(`/products?search=${encodeURIComponent(trimmed)}`);
        } else {
            router.push("/products");
        }
    }

    function clearSearch() {
        setSearchValue("");
        router.push("/products");
    }


    const t = {
        filters: locale === "ar" ? "الفلاتر" : "Filters",
        clearAll: locale === "ar" ? "مسح الكل" : "Clear all",
        searchTitle: locale === "ar" ? "بحث" : "Search",
        searchPlaceholder: locale === "ar" ? "البحث عن بيتزا..." : "Search pizzas...",
        categoryTitle: locale === "ar" ? "التصنيف" : "Category",
        priceRange: locale === "ar" ? "نطاق السعر" : "Price range",
        onSale: locale === "ar" ? "العروض فقط" : "On sale only"
    };
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-neutral-900 dark:text-white">{t.filters}</h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                    >
                        <X className="h-3 w-3" />
                        {t.clearAll}
                    </button>
                )}
            </div>

            {/* Search box */}
            <form onSubmit={handleSearchSubmit} className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t.searchTitle}
                </h3>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className="pl-9 pr-8"
                    />
                    {searchValue && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </form>

            <div className="border-t border-neutral-200 dark:border-neutral-800" />

            {/* Category filter */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t.categoryTitle}
                </h3>
                <div className="space-y-2.5">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center gap-2.5">
                            <Checkbox
                                id={`cat-${category.id}`}
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={() => toggleCategory(category.id)}
                                className="data-checked:bg-orange-600! data-checked:border-orange-600! data-checked:text-white! cursor-pointer"
                            />
                            <Label
                                htmlFor={`cat-${category.id}`}
                                className="text-sm font-normal text-neutral-600 dark:text-neutral-400 cursor-pointer"
                            >
                                {pickLocale(category.name, category.nameAr, locale)}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800" />

            {/* Price filter */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t.priceRange}
                </h3>
                <Slider
                    min={0}
                    max={maxPrice}
                    step={1}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="**:data-[slot=slider-range]:bg-orange-600 **:[[role=slider]]:bg-orange-600 **:[[role=slider]]:border-orange-600 cursor-pointer"

                />
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800" />

            {/* Discount filter */}
            <div className="flex items-center gap-2.5">
                <Checkbox
                    id="discount-only"
                    checked={onlyDiscounted}
                    onCheckedChange={(checked) => setOnlyDiscounted(checked === true)}
                    className="data-checked:bg-orange-600! data-checked:border-orange-600! data-checked:text-white! cursor-pointer"
                />
                <Label
                    htmlFor="discount-only"
                    className="text-sm font-normal text-neutral-600 dark:text-neutral-400 cursor-pointer"
                >
                    {t.onSale}
                </Label>
            </div>
        </div>
    );
}