"use client";

import { type Category } from "@/lib/types";
import { createCategory, deleteCategory, updateCategory } from "../actions";
import { EntityTable } from "@/app/(dashboard)/_components/EntityTable";
import { categoryColumns, getCategoryFields } from "@/utils/CategoriesFields";

interface CategoriesTableProps {
    categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
    return (
        <EntityTable<Category>
            title="Category"
            items={categories}
            columns={categoryColumns}
            fields={getCategoryFields()}
            onCreate={createCategory}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
        />
    );
}