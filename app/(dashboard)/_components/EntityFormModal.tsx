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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { type ModalField } from "@/lib/types";
import { UploadDropzone } from "@/components/UploadThingReexported";
import { X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

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

type FormValues = Record<string, string | boolean>;

function computeInitialValues<T extends Record<string, unknown>>(
    mode: "create" | "edit",
    item: T | null | undefined,
    fields: ModalField[]
): FormValues {
    const initial: FormValues = {};

    if (mode === "edit" && item) {
        fields.forEach((field) => {
            const raw = item[field.name as keyof T];

            if (field.type === "date" && raw) {
                try {
                    const dateObj = new Date(raw as string | Date);
                    initial[field.name] = dateObj.toISOString().split("T")[0];
                } catch {
                    initial[field.name] = "";
                }
            } else if (field.type === "file") {
                if (field.multiple) {
                    initial[field.name] = Array.isArray(raw) ? raw.join(",") : "";
                } else {
                    initial[field.name] = raw == null ? "" : String(raw);
                }
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
    const t = useTranslations("Admin");
    const [values, setValues] = useState<FormValues>(() =>
        computeInitialValues(mode, item, fields)
    );
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function setValue(name: string, value: string | boolean) {
        setValues((prev) => ({ ...prev, [name]: value }));
    }

    function getThumbnailsArray(name: string): string[] {
        const raw = values[name];
        if (typeof raw !== "string" || !raw.trim()) return [];
        return raw.split(",").map((t) => t.trim()).filter(Boolean);
    }

    function removeThumbnailAt(name: string, index: number) {
        const current = getThumbnailsArray(name);
        current.splice(index, 1);
        setValue(name, current.join(","));
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
                formData.set(field.name, value ?? "");
            }
        });

        if ("isActive" in values) {
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
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? t("add", { title }) : t("edit", { title })}
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
                                        dir={field.dir}
                                        value={(value as string) ?? ""}
                                        onChange={(e) => setValue(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        rows={3}
                                    />
                                ) : field.type === "select" ? (
                                    <Select
                                        value={(value as string) || undefined}
                                        onValueChange={(v) => setValue(field.name, v)}
                                    >
                                        <SelectTrigger id={field.name} className="w-full">
                                            <SelectValue placeholder={field.placeholder ?? t("selectPlaceholder")} />
                                        </SelectTrigger>
                                        <SelectContent position="popper" sideOffset={3}>
                                            {field.options?.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : field.type === "file" && field.multiple ? (
                                    <div className="space-y-3">
                                        <UploadDropzone
                                            endpoint="thumbnailUploader"
                                            className="ut-button:bg-orange-600! ut-button:hover:bg-orange-700! ut-button:ut-uploading:bg-orange-600! ut-button:ut-readying:bg-orange-600!"
                                            appearance={{
                                                container:
                                                    "w-full rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-colors cursor-pointer",
                                                uploadIcon: "text-neutral-400",
                                                label:
                                                    "text-sm text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400",
                                                allowedContent: "text-xs text-neutral-400 dark:text-neutral-500",
                                            }}
                                            onClientUploadComplete={(res) => {
                                                const uploaded = res
                                                    .map((f) => f.ufsUrl)
                                                    .filter(Boolean) as string[];
                                                const current = getThumbnailsArray(field.name);
                                                setValue(
                                                    field.name,
                                                    [...current, ...uploaded].join(",")
                                                );
                                            }}
                                            onUploadError={(error: Error) => {
                                                setError(t("uploadFailed", { message: error.message }));
                                            }}
                                        />

                                        {getThumbnailsArray(field.name).length > 0 && (
                                            <div className="grid grid-cols-4 gap-2">
                                                {getThumbnailsArray(field.name).map((url, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative group rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden h-20"
                                                    >
                                                        <Image
                                                            src={url}
                                                            alt={`${field.label} ${idx + 1}`}
                                                            fill
                                                            unoptimized
                                                            className="object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeThumbnailAt(field.name, idx)}
                                                            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : field.type === "file" ? (
                                    <div className="space-y-3">
                                        <UploadDropzone
                                            endpoint="imageUploader"
                                            className="ut-button:bg-orange-600! ut-button:hover:bg-orange-700! ut-button:ut-uploading:bg-orange-600! ut-button:ut-readying:bg-orange-600!"
                                            appearance={{
                                                container:
                                                    "w-full rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-colors cursor-pointer",
                                                uploadIcon: "text-neutral-400",
                                                label:
                                                    "text-sm text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400",
                                                allowedContent: "text-xs text-neutral-400 dark:text-neutral-500",
                                            }}
                                            onClientUploadComplete={(res) => {
                                                setValue(field.name, res[0]?.ufsUrl ?? "");
                                            }}
                                            onUploadError={(error: Error) => {
                                                setError(t("uploadFailed", { message: error.message }));
                                            }}
                                        />

                                        {value && (
                                            <div className="relative group rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden h-32 w-32">
                                                <Image
                                                    src={value as string}
                                                    alt={field.label}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setValue(field.name, "")}
                                                    className="absolute top-1 right-1 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
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
                                        dir={field.dir}
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
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                        {loading ? t("saving") : mode === "create" ? t("add", { title }) : t("saveChanges")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}