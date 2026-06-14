import { type ColumnDef } from "@/app/(dashboard)/_components/EntityTable";
import { type Offer, type ModalField } from "@/lib/types";

export const offerColumns: ColumnDef<Offer>[] = [
  { key: "image", label: "Image", type: "image" },
  { key: "name", label: "Name" },
  { key: "discount", label: "Discount", render: (item) => `${item.discount}%` },
  {
    key: "startDate",
    label: "Start Date",
    render: (item) =>
      item.startDate ? new Date(item.startDate).toLocaleDateString() : "—",
  },
  {
    key: "endDate",
    label: "End Date",
    render: (item) =>
      item.endDate ? new Date(item.endDate).toLocaleDateString() : "—",
  },
];

export const offerFields: ModalField[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "e.g. Pizza Friday",
    required: true,
    colSpan: 2,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Short description...",
    colSpan: 2,
  },
  {
    name: "image",
    label: "Image URL",
    type: "file",
    placeholder: "https://...",
    colSpan: 2,
  },
  {
    name: "discount",
    label: "Discount (%)",
    type: "number",
    min: 1,
    max: 100,
    required: true,
  },
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "endDate", label: "End Date", type: "date" },
];
