import { type ColumnDef } from "@/app/(dashboard)/_components/EntityTable";
import { type Category, ModalField } from "@/lib/types";

export const categoryColumns: ColumnDef<Category>[] = [
  { key: "image", label: "Image", type: "image" },
  { key: "name", label: "Name" },
  { key: "nameAr", label: "الاسم", render: (item) => item.nameAr ?? "—" },
  { key: "description", label: "Description" },
  { key: "isActive", label: "Status", type: "badge" },
];

export function getCategoryFields(): ModalField[] {
  return [
    {
      name: "name",
      label: "Name (English)",
      type: "text",
      placeholder: "e.g. Pizza, Burgers...",
      required: true,
    },
    {
      name: "nameAr",
      label: "الاسم (عربي)",
      type: "text",
      placeholder: "مثال: بيتزا، برجر...",
      dir: "rtl",
    },
    {
      name: "description",
      label: "Description (English)",
      type: "textarea",
      placeholder: "Short description about this category...",
      colSpan: 2,
    },
    {
      name: "descriptionAr",
      label: "الوصف (عربي)",
      type: "textarea",
      placeholder: "وصف مختصر عن هذا القسم...",
      dir: "rtl",
      colSpan: 2,
    },
    {
      name: "image",
      label: "Category Image",
      type: "file", 
      required: true,
      colSpan: 2,
    },
    {
      name: "isActive",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ];
}