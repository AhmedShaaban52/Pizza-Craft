import Link from "next/link";
import Image from "next/image";
import { type Category } from "@/lib/types";

interface CategoryCardGridProps {
    categories: Category[];
}

export function CategoryCardGrid({ categories }: CategoryCardGridProps) {
    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 py-20 text-center">
                <p className="text-neutral-500 dark:text-neutral-400">
                    No categories available right now.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="group"
                >
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 group-hover:ring-orange-500/50 transition-all">
                        <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 p-4">
                            <h3 className="font-semibold text-white text-base">
                                {category.name}
                            </h3>
                            {category.description && (
                                <p className="mt-0.5 text-xs text-white/70 line-clamp-1">
                                    {category.description}
                                </p>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}