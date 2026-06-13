"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Category } from "@/lib/types";
import { CategoryFormModal } from "./CategoryFormModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";


interface CategoriesTableProps {
    categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
    const [addOpen, setAddOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    onClick={() => setAddOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800 text-left text-neutral-500 dark:text-neutral-400 uppercase text-xs tracking-wider">
                            <th className="px-4 py-3 font-medium">Image</th>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Description</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-8 text-center text-neutral-400 dark:text-neutral-500"
                                >
                                    No categories found.
                                </td>
                            </tr>
                        )}

                        {categories.map((category) => (
                            <tr
                                key={category.id}
                                className="border-b border-neutral-100 dark:border-neutral-900 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                            >
                                <td className="px-4 py-3">
                                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">
                                    {category.name}
                                </td>
                                <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 max-w-xs truncate">
                                    {category.description || "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${category.isActive
                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                            : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${category.isActive ? "bg-emerald-500" : "bg-neutral-400"
                                                }`}
                                        />
                                        {category.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setEditCategory(category)}
                                            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteCategory(category)}
                                            className="p-2 rounded-lg text-neutral-500 hover:bg-red-50 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            <CategoryFormModal
                key="create"
                mode="create"
                open={addOpen}
                onOpenChange={setAddOpen}
            />

            {/* Edit Modal */}
            <CategoryFormModal
                key={editCategory ? `edit-${editCategory.id}` : "edit-blank"}
                open={!!editCategory}
                onOpenChange={(open) => !open && setEditCategory(null)}
                mode="edit"
                category={editCategory}
            />

            {/* Delete Modal */}
            <DeleteCategoryModal
                open={!!deleteCategory}
                onOpenChange={(open) => !open && setDeleteCategory(null)}
                category={deleteCategory}
            />
        </div>
    );
}