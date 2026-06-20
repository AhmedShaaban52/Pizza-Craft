import { getProducts, getProductsBySearch } from "@/app/(dashboard)/admin/products/actions";
import { getCategories } from "@/app/(dashboard)/admin/categories/actions";
import { type ProductWithCategory } from "@/utils/ProductsFields";
import { type Category } from "@/lib/types";
import { ProductsFilter } from "./_components/ProductsFilter";

interface ProductsPageProps {
    searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const { search } = await searchParams;

    const [productsResult, categoriesResult] = await Promise.all([
        search ? getProductsBySearch(search) : getProducts(),
        getCategories(),
    ]);

    const products = (productsResult.success ? productsResult.data ?? [] : []) as ProductWithCategory[];
    const categories = (categoriesResult.success ? categoriesResult.data ?? [] : []) as Category[];

    const activeProducts = products.filter((p) => p.isActive !== false);
    const activeCategories = categories.filter((c) => c.isActive !== false);

    return (
        <div className="px-4 md:px-12 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                    {search ? `Results for "${search}"` : "Our Menu"}
                </h1>
                <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                    {search
                        ? `${activeProducts.length} ${activeProducts.length === 1 ? "item" : "items"} found`
                        : "Handcrafted pizzas, made fresh to order."}
                </p>
            </div>

            <ProductsFilter products={activeProducts} categories={activeCategories} />
        </div>
    );
}