import { getTranslations } from "next-intl/server";
import { getProducts, getProductsBySearch } from "@/app/(dashboard)/admin/products/actions";
import { getCategories } from "@/app/(dashboard)/admin/categories/actions";
import { type ProductWithCategory } from "@/utils/ProductsFields";
import { type Category } from "@/lib/types";
import { ProductsFilter } from "./_components/ProductsFilter";
import { getUserFavoriteIds } from "@/lib/actions/favorites-actions";

interface ProductsPageProps {
    searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const { search, category } = await searchParams;
    const t = await getTranslations("Products");

    const [productsResult, categoriesResult, favoriteIds] = await Promise.all([
        search ? getProductsBySearch(search) : getProducts(),
        getCategories(),
        getUserFavoriteIds(),
    ]);

    const products = (productsResult.success ? productsResult.data ?? [] : []) as ProductWithCategory[];
    const categories = (categoriesResult.success ? categoriesResult.data ?? [] : []) as Category[];

    const activeProducts = products.filter((p) => p.isActive !== false);
    const activeCategories = categories.filter((c) => c.isActive !== false);

    return (
        <div className="px-4 md:px-12 py-8 mt-16 text-start">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                    {t("pageTitle")}
                </h1>
                <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                    {search
                        ? t("itemsFound", { count: activeProducts.length })
                        : t("pageDescription")}
                </p>
            </div>

            <ProductsFilter
                products={activeProducts}
                categories={activeCategories}
                favoriteIds={favoriteIds}
                initialCategory={category}
            />
        </div>
    );
}