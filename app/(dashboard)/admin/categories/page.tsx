import { getCategories } from "./actions";
import { CategoriesTable } from "./_components/CategoriesTable";

export default async function CategoriesPage() {
  const result = await getCategories();
  const categories = result.success ? result.data ?? [] : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
        Categories
      </h1>

      <CategoriesTable categories={categories} />
    </div>
  );
}