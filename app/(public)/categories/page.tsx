import { getTranslations } from "next-intl/server";
import { getCategories } from "@/app/(dashboard)/admin/categories/actions";
import { type Category } from "@/lib/types";
import { CategoryCardGrid } from "../_components/CategoryCardGrid";

export default async function CategoriesPage() {
  const t = await getTranslations("Categories");
  const result = await getCategories();
  const categories = (result.success ? result.data ?? [] : []) as Category[];
  const activeCategories = categories.filter((c) => c.isActive !== false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          {t("pageTitle")}
        </h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          {t("pageSubtitle")}
        </p>
      </div>

      <CategoryCardGrid categories={activeCategories} />
    </div>
  );
}