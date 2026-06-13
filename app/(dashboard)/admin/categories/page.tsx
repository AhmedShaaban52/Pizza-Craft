import { categoryColumns, categoryFields } from "@/utils/CategoriesFields";
import { getCategories, createCategory, updateCategory, deleteCategory } from "./actions";
import { type Category } from "@/lib/types";
import { EntityTable } from "../../_components/EntityTable";

export default async function CategoriesPage() {
  const result = await getCategories();
  const categories = result.success ? result.data ?? [] : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
        Categories
      </h1>

      <EntityTable<Category>
        title="Category"
        items={categories}
        columns={categoryColumns}
        fields={categoryFields}
        onCreate={createCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
      />
    </div>
  );
}