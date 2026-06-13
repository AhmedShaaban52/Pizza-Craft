"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Category } from "@/lib/types";
import { deleteCategory } from "../actions";

interface DeleteCategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category | null;
}

export function DeleteCategoryModal({
    open,
    onOpenChange,
    category,
}: DeleteCategoryModalProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!category) return;
        setError(null);
        setLoading(true);

        const result = await deleteCategory(category.id);

        setLoading(false);

        if (!result.success) {
            setError(result.error);
            return;
        }

        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete Category</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-neutral-900 dark:text-white">
                            {category?.name}
                        </span>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}