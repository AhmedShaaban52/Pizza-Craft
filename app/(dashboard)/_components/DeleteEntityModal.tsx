"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
    const t = useTranslations("Admin");
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
                    <DialogTitle>{t("delete", { title })}</DialogTitle>
                    <DialogDescription>
                        {itemName
                            ? t.rich("deleteConfirm", {
                                name: itemName,
                                b: (chunks) => (
                                    <span className="font-semibold text-neutral-900 dark:text-white">
                                        {chunks}
                                    </span>
                                ),
                            })
                            : t("deleteConfirmGeneric")}
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
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {loading ? t("deleting") : t("deleteAction")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}