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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { type ModalField } from "@/lib/types";

type ActionResult = { success: true } | { success: false; error: string };

interface EntityFormModalProps<T extends Record<string, unknown>> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    title: string;
    fields: ModalField[];
    item?: T | null;
    onCreate: (formData: FormData) => Promise<ActionResult>;
    onUpdate: (id: string, formData: FormData) => Promise<ActionResult>;
    idKey?: keyof T;
}

function computeInitialValues<T extends Record<string, unknown>>(
    mode: "create" | "edit",
    item: T | null | undefined,
    fields: ModalField[]
): Record<string, string | boolean> {
    const initial: Record<string, string | boolean> = {};

    if (mode === "edit" && item) {
        fields.forEach((field) => {
            const raw = item[field.name as keyof T];
            if (field.type === "files") {
                initial[field.name] = Array.isArray(raw) ? raw.join(",") : "";
            } else if (typeof raw === "boolean") {
                initial[field.name] = raw;
            } else {
                initial[field.name] = raw == null ? "" : String(raw);
            }
        });
    } else {
        fields.forEach((field) => {
            initial[field.name] = field.name === "isActive" ? true : "";
        });
    }

    return initial;
}

export function EntityFormModal<T extends Record<string, unknown>>({
    open,
    onOpenChange,
    mode,
    title,
    fields,
    item,
    onCreate,
    onUpdate,
    idKey = "id" as keyof T,
}: EntityFormModalProps<T>) {
    if (!open) return null;

    return (
        <EntityFormModalInner
            key={mode === "edit" ? String(item?.[idKey] ?? "edit") : "create"}
            open={open}
            onOpenChange={onOpenChange}
            mode={mode}
            title={title}
            fields={fields}
            item={item}
            onCreate={onCreate}
            onUpdate={onUpdate}
            idKey={idKey}
        />
    );
}

function EntityFormModalInner<T extends Record<string, unknown>>({
    open,
    onOpenChange,
    mode,
    title,
    fields,
    item,
    onCreate,
    onUpdate,
    idKey = "id" as keyof T,
}: EntityFormModalProps<T>) {
    const [values, setValues] = useState<Record<string, string | boolean>>(() =>
        computeInitialValues(mode, item, fields)
    );
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function setValue(name: string, value: string | boolean) {
        setValues((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit() {
        setError(null);
        setLoading(true);

        const formData = new FormData();
        fields.forEach((field) => {
            const value = values[field.name];
            if (typeof value === "boolean") {
                formData.set(field.name, value ? "true" : "false");
            } else {
                formData.set(field.name, value != null ? String(value) : "");
            }
        });

        if ("isActive" in values && !fields.some(f => f.name === "isActive")) {
            formData.set("isActive", values.isActive ? "true" : "false");
        }

        const result =
            mode === "create"
                ? await onCreate(formData)
                : await onUpdate(String(item?.[idKey]), formData);

        setLoading(false);

        if (!result.success) {
            setError(result.error);
            return;
        }

        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-lg"
                onPointerDownOutside={(e) => {
                    if ((e.target as HTMLElement).closest('[role="listbox"]')) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? `Add ${title}` : `Edit ${title}`}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-2">
                    {fields.map((field) => {
                        const span = field.colSpan === 2 ? "col-span-2" : "col-span-2 sm:col-span-1";
                        const value = values[field.name];

                        return (
                            <div key={field.name} className={`space-y-2 ${span}`}>
                                <Label htmlFor={field.name}>{field.label}</Label>

                                {field.type === "textarea" ? (
                                    <Textarea
                                        id={field.name}
                                        value={(value as string) ?? ""}
                                        onChange={(e) => setValue(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        rows={3}
                                    />
                                ) : field.type === "select" ? (
                                    <div className="relative w-full">
                                        <Select
                                            value={(value as string) || undefined}
                                            onValueChange={(v) => setValue(field.name, v)}
                                        >
                                            <SelectTrigger id={field.name} className="w-full">
                                                <SelectValue placeholder={field.placeholder ?? "Select..."} />
                                            </SelectTrigger>

                                            <SelectContent
                                                position="popper"
                                                    className="z-200 max-h-60 w-(--radix-select-trigger-width)"
                                            >
                                                {field.options?.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {/* حقل الإدخال المخفي لحل مشكلة السيرفر أكشن أيرور (null) */}
                                        <input
                                            type="hidden"
                                            name={field.name}
                                            value={(value as string) ?? ""}
                                        />
                                    </div>
                                ) : field.type === "file" || field.type === "files" ? (
                                    <Input
                                        id={field.name}
                                        value={(value as string) ?? ""}
                                        onChange={(e) => setValue(field.name, e.target.value)}
                                        placeholder={
                                            field.placeholder ??
                                            (field.type === "files"
                                                ? "https://img1.jpg, https://img2.jpg"
                                                : "https://...")
                                        }
                                    />
                                ) : field.type === "date" ? (
                                    <Input
                                        id={field.name}
                                        type="date"
                                        value={(value as string) ?? ""}
                                        onChange={(e) => setValue(field.name, e.target.value)}
                                    />
                                ) : (
                                    <Input
                                        id={field.name}
                                        type={field.type}
                                        value={(value as string) ?? ""}
                                        onChange={(e) => setValue(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        min={field.min}
                                        max={field.max}
                                    />
                                )}
                            </div>
                        );
                    })}

                    {"isActive" in values && (
                        <div className="col-span-2 flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-2.5">
                            <Label htmlFor="isActive" className="cursor-pointer">
                                Active
                            </Label>
                            <Switch
                                id="isActive"
                                checked={values.isActive as boolean}
                                onCheckedChange={(checked) => setValue("isActive", checked)}
                            />
                        </div>
                    )}
                </div>

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
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {loading ? "Saving..." : mode === "create" ? `Add ${title}` : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}