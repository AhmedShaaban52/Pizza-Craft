import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Category } from "@/lib/types";
import { X } from "lucide-react";

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
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-neutral-900 dark:text-white">Filters</h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                        <X className="h-3 w-3" />
                        Clear all
                    </button>
                )}
            </div>

            {/* Category filter */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Category
                </h3>
                <div className="space-y-2.5">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center gap-2.5">
                            <Checkbox
                                id={`cat-${category.id}`}
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={() => toggleCategory(category.id)}
                                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                            />
                            <Label
                                htmlFor={`cat-${category.id}`}
                                className="text-sm font-normal text-neutral-600 dark:text-neutral-400 cursor-pointer"
                            >
                                {category.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800" />

            {/* Price filter */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Price range
                </h3>
                <Slider
                    min={0}
                    max={maxPrice}
                    step={1}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="**:[[role=slider]]:bg-emerald-600 **:[[role=slider]]:border-emerald-600"
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
                    className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <Label
                    htmlFor="discount-only"
                    className="text-sm font-normal text-neutral-600 dark:text-neutral-400 cursor-pointer"
                >
                    On sale only
                </Label>
            </div>
        </div>
    );
}