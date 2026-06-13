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

type ActionResult = { success: true } | { success: false; error: string };

interface DeleteEntityModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    itemName?: string;
    itemId?: string;
    onDelete: (id: string) => Promise<ActionResult>;
}

export function DeleteEntityModal({
    open,
    onOpenChange,
    title,
    itemName,
    itemId,
    onDelete,
}: DeleteEntityModalProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!itemId) return;
        setError(null);
        setLoading(true);

        const result = await onDelete(itemId);

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
                    <DialogTitle>Delete {title}</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        {itemName && (
                            <span className="font-semibold text-neutral-900 dark:text-white">
                                {itemName}
                            </span>
                        )}
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