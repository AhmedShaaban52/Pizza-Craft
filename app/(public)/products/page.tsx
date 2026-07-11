import { cookies } from "next/headers";
import { getProducts, getProductsBySearch } from "@/app/(dashboard)/admin/products/actions";
import { getCategories } from "@/app/(dashboard)/admin/categories/actions";
import { getUserFavoriteIds } from "@/lib/favorites-actions";
import { type ProductWithCategory } from "@/utils/ProductsFields";
import { type Category } from "@/lib/types";
import { ProductsFilter } from "./_components/ProductsFilter";

interface ProductsPageProps {
    searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const { search, category } = await searchParams;
    const cookieStore = await cookies();
    const locale = cookieStore.get("locale")?.value === "ar" ? "ar" : "en";

    const t = {
        title: locale === "ar" ? "قائمتنا" : "Our Menu",
        itemsFound: (count: number) =>
            locale === "ar"
                ? `تم العثور على ${count} عنصر`
                : `${count} ${count === 1 ? "item" : "items"} found`,
        description: locale === "ar"
            ? "بيتزا محضرة يدوياً، طازجة عند الطلب."
            : "Handcrafted pizzas, made fresh to order."
    };

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
                    {t.title}
                </h1>
                <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                    {search
                        ? t.itemsFound(activeProducts.length)
                        : t.description}
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