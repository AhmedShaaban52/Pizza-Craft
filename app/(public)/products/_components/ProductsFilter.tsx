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
import { ProductGridCard } from "./ProductGridCard";
import { FilterSidebar } from "./FilterSidebar";

interface ProductsFilterProps {
    products: ProductWithCategory[];
    categories: Category[];
}

export function ProductsFilter({ products, categories }: ProductsFilterProps) {
    const maxPrice = useMemo(
        () => Math.ceil(Math.max(...products.map((p) => Number(p.price)), 50)),
        [products]
    );

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
            {/* Mobile filter trigger */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
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

            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5">
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
                    {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
                </p>

                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 py-20 text-center">
                        <p className="text-neutral-500 dark:text-neutral-400">
                            No items match your filters.
                        </p>
                        <Button
                            variant="link"
                            onClick={clearFilters}
                            className="mt-2 text-emerald-600 dark:text-emerald-400"
                        >
                            Clear filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductGridCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
