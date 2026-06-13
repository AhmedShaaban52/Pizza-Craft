"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ModalField } from "@/lib/types";
import { EntityFormModal } from "./EntityFormModal";
import { DeleteEntityModal } from "./DeleteEntityModal";

type ActionResult = { success: true } | { success: false; error: string };

export interface ColumnDef<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    type?: "image" | "badge" | "text";
}

interface EntityTableProps<T extends Record<string, unknown>> {
    title: string;
    items: T[];
    columns: ColumnDef<T>[];
    fields: ModalField[];
    onCreate: (formData: FormData) => Promise<ActionResult>;
    onUpdate: (id: string, formData: FormData) => Promise<ActionResult>;
    onDelete: (id: string) => Promise<ActionResult>;
    idKey?: keyof T;
    nameKey?: keyof T;
}

export function EntityTable<T extends Record<string, unknown>>({
    title,
    items,
    columns,
    fields,
    onCreate,
    onUpdate,
    onDelete,
    idKey = "id" as keyof T,
    nameKey = "name" as keyof T,
}: EntityTableProps<T>) {
    const [addOpen, setAddOpen] = useState(false);
    const [editItem, setEditItem] = useState<T | null>(null);
    const [deleteItem, setDeleteItem] = useState<T | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    onClick={() => setAddOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add {title}
                </Button>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800 text-left text-neutral-500 dark:text-neutral-400 uppercase text-xs tracking-wider">
                            {columns.map((col) => (
                                <th key={col.key} className="px-4 py-3 font-medium whitespace-nowrap">
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="px-4 py-8 text-center text-neutral-400 dark:text-neutral-500"
                                >
                                    No {title.toLowerCase()} found.
                                </td>
                            </tr>
                        )}

                        {items.map((item) => (
                            <tr
                                key={String(item[idKey])}
                                className="border-b border-neutral-100 dark:border-neutral-900 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3 align-middle">
                                        {col.render ? (
                                            col.render(item)
                                        ) : col.type === "image" ? (
                                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                                <Image
                                                    src={String(item[col.key as keyof T] ?? "")}
                                                    alt={String(item[nameKey] ?? "")}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : col.type === "badge" ? (
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${item[col.key as keyof T]
                                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                                                    }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${item[col.key as keyof T] ? "bg-emerald-500" : "bg-neutral-400"
                                                        }`}
                                                />
                                                {item[col.key as keyof T] ? "Active" : "Inactive"}
                                            </span>
                                        ) : (
                                            <span className="text-neutral-700 dark:text-neutral-300">
                                                {String(item[col.key as keyof T] ?? "—")}
                                            </span>
                                        )}
                                    </td>
                                ))}

                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setEditItem(item)}
                                            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteItem(item)}
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

            <EntityFormModal
                open={addOpen}
                onOpenChange={setAddOpen}
                mode="create"
                title={title}
                fields={fields}
                onCreate={onCreate}
                onUpdate={onUpdate}
                idKey={idKey}
            />

            <EntityFormModal
                open={!!editItem}
                onOpenChange={(open) => !open && setEditItem(null)}
                mode="edit"
                title={title}
                fields={fields}
                item={editItem}
                onCreate={onCreate}
                onUpdate={onUpdate}
                idKey={idKey}
            />

            <DeleteEntityModal
                open={!!deleteItem}
                onOpenChange={(open) => !open && setDeleteItem(null)}
                title={title}
                itemName={deleteItem ? String(deleteItem[nameKey]) : undefined}
                itemId={deleteItem ? String(deleteItem[idKey]) : undefined}
                onDelete={onDelete}
            />
        </div>
    );
}