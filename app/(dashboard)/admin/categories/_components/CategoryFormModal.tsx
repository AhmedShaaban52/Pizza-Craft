"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { type Category } from "@/lib/types";
import { createCategory, updateCategory } from "../actions";

interface CategoryFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    category?: Category | null;
}

export function CategoryFormModal({
    open,
    onOpenChange,
    mode,
    category,
}: CategoryFormModalProps) {
    const [name, setName] = useState(() => (mode === "edit" && category ? category.name : ""));
    const [description, setDescription] = useState(() => (mode === "edit" && category ? (category.description ?? "") : ""));
    const [image, setImage] = useState(() => (mode === "edit" && category ? category.image : ""));
    const [isActive, setIsActive] = useState(() => (mode === "edit" && category ? category.isActive : true));

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        setError(null);
        setLoading(true);

        const formData = new FormData();
        formData.set("name", name);
        formData.set("description", description || "");
        formData.set("image", image);
        formData.set("isActive", isActive ? "true" : "false");

        const result =
            mode === "create"
                ? await createCategory(formData)
                : await updateCategory(category!.id, formData);

        setLoading(false);

        if (!result.success) {
            setError(result.error);
            return;
        }

        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Add Category" : "Edit Category"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Pizza"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short description..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                            id="image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-2.5">
                        <Label htmlFor="isActive" className="cursor-pointer">
                            Active
                        </Label>
                        <Switch
                            id="isActive"
                            checked={isActive}
                            onCheckedChange={setIsActive}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {loading
                            ? "Saving..."
                            : mode === "create"
                                ? "Add Category"
                                : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}