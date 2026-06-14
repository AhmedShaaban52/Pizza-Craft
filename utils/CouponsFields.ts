import { type ColumnDef } from "@/app/(dashboard)/_components/EntityTable";
import { type Coupon, type ModalField } from "@/lib/types";

export const couponColumns: ColumnDef<Coupon>[] = [
  { key: "code", label: "Code" },
  {
    key: "discountType",
    label: "Discount",
    render: (item) =>
      item.discountType === "percent"
        ? `${item.discountValue}%`
        : `$${item.discountValue}`,
  },
  {
    key: "minOrderAmount",
    label: "Min Order",
    render: (item) => `$${item.minOrderAmount ?? "0"}`,
  },
  {
    key: "usedCount",
    label: "Used",
    render: (item) => `${item.usedCount ?? 0} / ${item.maxUses ?? "∞"}`,
  },
  {
    key: "endDate",
    label: "Expires",
    render: (item) =>
      item.endDate ? new Date(item.endDate).toLocaleDateString() : "—",
  },
  { key: "isActive", label: "Status", type: "badge" },
];

export const couponFields: ModalField[] = [
  {
    name: "code",
    label: "Coupon Code",
    type: "text",
    placeholder: "e.g. SAVE20",
    required: true,
    colSpan: 2,
  },
  {
    name: "discountType",
    label: "Discount Type",
    type: "select",
    required: true,
    options: [
      { label: "Percent", value: "percent" },
      { label: "Amount", value: "amount" },
    ],
  },
  {
    name: "discountValue",
    label: "Discount Value",
    type: "number",
    min: 0.01,
    required: true,
  },
  {
    name: "minOrderAmount",
    label: "Minimum Order Amount",
    type: "number",
    min: 0,
  },
  { name: "maxUses", label: "Max Uses", type: "number", min: 1 },
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "endDate", label: "End Date", type: "date" },
];
