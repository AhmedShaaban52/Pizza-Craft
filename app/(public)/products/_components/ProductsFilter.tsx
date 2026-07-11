"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { type ProductWithCategory } from "@/utils/ProductsFields";
import { type Category } from "@/lib/types";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { getFinalPrice } from "@/lib/getFinalPrice";
import { FilterSidebar } from "./FilterSidebar";
import ProductGridCard from "./ProductGridCard";
import { useLocale } from "@/context/locale-context";

interface ProductsFilterProps {
    products: ProductWithCategory[];
    categories: Category[];
    favoriteIds: string[];
    initialCategory?: string;
}

export function ProductsFilter({ products, categories, favoriteIds, initialCategory }: ProductsFilterProps) {
    const { locale } = useLocale();

    // Define translations
    const t = {
        filters: locale === "ar" ? "الفلاتر" : "Filters",
        item: (count: number) => locale === "ar"
            ? `${count} ${count === 1 ? "عنصر" : "عناصر"}`
            : `${count} ${count === 1 ? "item" : "items"}`,
        noItems: locale === "ar" ? "لا توجد عناصر تطابق فلاترك." : "No items match your filters.",
        clearFilters: locale === "ar" ? "مسح الفلاتر" : "Clear filters"
    };

    const maxPrice = useMemo(
        () => Math.ceil(Math.max(...products.map((p) => Number(p.price)), 50)),
        [products]
    );

    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialCategory ? [initialCategory] : []
    );
    const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
    const [onlyDiscounted, setOnlyDiscounted] = useState(false);

    function toggleCategory(id: string) {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    }

    function clearFilters() {
        setSelectedCategories([]);
        setPriceRange([0, maxPrice]);
        setOnlyDiscounted(false);
    }

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            if (
                selectedCategories.length > 0 &&
                !selectedCategories.includes(product.categoryId)
            ) {
                return false;
            }

            const price = getFinalPrice(product);
            if (price < priceRange[0] || price > priceRange[1]) {
                return false;
            }

            if (onlyDiscounted && !product.discountType) {
                return false;
            }

            return true;
        });
    }, [products, selectedCategories, priceRange, onlyDiscounted]);

    const hasActiveFilters =
        selectedCategories.length > 0 ||
        priceRange[0] !== 0 ||
        priceRange[1] !== maxPrice ||
        onlyDiscounted;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            {t.filters}
                            {hasActiveFilters && (
                                <span className="ml-auto h-2 w-2 rounded-full bg-orange-500" />
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-75 overflow-y-auto">
                        <div className="p-4">
                            <FilterSidebar
                                categories={categories}
                                selectedCategories={selectedCategories}
                                toggleCategory={toggleCategory}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                maxPrice={maxPrice}
                                onlyDiscounted={onlyDiscounted}
                                setOnlyDiscounted={setOnlyDiscounted}
                                hasActiveFilters={hasActiveFilters}
                                clearFilters={clearFilters}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <aside className="hidden lg:block">
                <div className=" rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
                    <FilterSidebar
                        categories={categories}
                        selectedCategories={selectedCategories}
                        toggleCategory={toggleCategory}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        maxPrice={maxPrice}
                        onlyDiscounted={onlyDiscounted}
                        setOnlyDiscounted={setOnlyDiscounted}
                        hasActiveFilters={hasActiveFilters}
                        clearFilters={clearFilters}
                    />
                </div>
            </aside>

            <div>
                <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
                    {t.item(filteredProducts.length)}
                </p>

                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 py-20 text-center">
                        <p className="text-neutral-500 dark:text-neutral-400">
                            {t.noItems}
                        </p>
                        <Button
                            variant="link"
                            onClick={clearFilters}
                            className="mt-2 text-orange-600 dark:text-orange-400"
                        >
                            {t.clearFilters}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductGridCard
                                key={product.id}
                                product={product}
                                isFavorited={favoriteIds.includes(product.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}