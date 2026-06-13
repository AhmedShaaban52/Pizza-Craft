import { ColumnDef } from "@/app/(dashboard)/_components/EntityTable";
import { type Category, type ModalField } from "@/lib/types";

export const categoryColumns: ColumnDef<Category>[] = [
    { key: "image", label: "Image", type: "image" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "isActive", label: "Status", type: "badge" },
];

export const categoryFields: ModalField[] = [
    { name: "name", label: "Name", type: "text", placeholder: "e.g. Pizza", required: true, colSpan: 2 },
    { name: "description", label: "Description", type: "textarea", placeholder: "Short description...", colSpan: 2 },
    { name: "image", label: "Image URL", type: "file", placeholder: "https://...", colSpan: 2 },
];