import { type ColumnDef } from "@/app/(dashboard)/_components/EntityTable";
import { type Product, type Category, type ModalField } from "@/lib/types";

export type ProductWithCategory = Product & {
  category: { name: string } | null;
};

export const productColumns: ColumnDef<ProductWithCategory>[] = [
  { key: "image", label: "Image", type: "image" },
  { key: "name", label: "Name" },
  {
    key: "category",
    label: "Category",
    render: (item) => item.category?.name ?? "—",
  },
  { key: "price", label: "Price", render: (item) => `$${item.price}` },
  { key: "isActive", label: "Status", type: "badge" },
];

export function getProductFields(categories: Category[]): ModalField[] {
  return [
    { name: "name", label: "Name", type: "text", required: true, colSpan: 2 },
    { name: "description", label: "Description", type: "textarea", colSpan: 2 },
    { name: "image", label: "Product Image", type: "file", colSpan: 2 },
    {
      name: "thumbnails",
      label: "Thumbnails",
      type: "file",
      multiple: true,
      colSpan: 2,
    },
    { name: "price", label: "Price", type: "number", min: 0, required: true },
    {
      name: "categoryId",
      label: "Category",
      type: "select",
      required: true,
      options: categories.map((c) => ({ label: c.name, value: c.id })),
    },
    {
      name: "discountType",
      label: "Discount Type",
      type: "select",
      options: [
        { label: "Percent", value: "percent" },
        { label: "Amount", value: "amount" },
      ],
    },
    { name: "discountValue", label: "Discount Value", type: "number", min: 0 },
  ];
}
