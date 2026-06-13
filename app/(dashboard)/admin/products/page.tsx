import { getProducts } from "./actions";
import { getCategories } from "../categories/actions";
import { ProductsTable } from "./_components/ProductsTable";
import { type ProductWithCategory } from "@/utils/ProductsFields";

export default async function ProductsPage() {
  const [productsResult, categoriesResult] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const products = (productsResult.success ? productsResult.data ?? [] : []) as ProductWithCategory[];
  const categories = categoriesResult.success ? categoriesResult.data ?? [] : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
        Products
      </h1>

      <ProductsTable products={products} categories={categories} />
    </div>
  );
}