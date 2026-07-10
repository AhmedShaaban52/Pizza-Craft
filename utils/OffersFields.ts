import { type ColumnDef } from "@/app/(dashboard)/_components/EntityTable";
import { type ModalField, type Offer } from "@/lib/types";

export const offerColumns: ColumnDef<Offer>[] = [
  { key: "image", label: "Image", type: "image" },
  { key: "name", label: "Name" },
  { key: "nameAr", label: "الاسم", render: (item) => item.nameAr ?? "" },
  {
    key: "discount",
    label: "Discount",
    render: (item) => `${item.discount}% OFF`,
  },
  {
    key: "startDate",
    label: "Start Date",
    render: (item) =>
      item.startDate ? new Date(item.startDate).toLocaleDateString() : "",
  },
  {
    key: "endDate",
    label: "End Date",
    render: (item) =>
      item.endDate ? new Date(item.endDate).toLocaleDateString() : "",
  },
];

export function getOfferFields(): ModalField[] {
  return [
    {
      name: "name",
      label: "Offer Name (English)",
      type: "text",
      required: true,
    },
    {
      name: "nameAr",
      label: "اسم العرض (عربي)",
      type: "text",
      dir: "rtl",
    },
    {
      name: "description",
      label: "Description (English)",
      type: "textarea",
      colSpan: 2,
    },
    {
      name: "descriptionAr",
      label: "الوصف (عربي)",
      type: "textarea",
      dir: "rtl",
      colSpan: 2,
    },
    {
      name: "image",
      label: "Offer Banner",
      type: "file",
      required: true,
      colSpan: 2,
    },
    {
      name: "discount",
      label: "Discount (%)",
      type: "number",
      min: 0,
      required: true,
      colSpan: 2,
    },
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "endDate", label: "End Date", type: "date" },
  ];
}
