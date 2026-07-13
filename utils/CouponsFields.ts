import { type ColumnDef } from "@/app/(dashboard)/_components/EntityTable";
import { type Coupon, type ModalField } from "@/lib/types";

type Translator = (key: string) => string;

export function getCouponColumns(
  t: Translator,
  locale: string,
): ColumnDef<Coupon>[] {
  return [
    { key: "code", label: t("columns.code") },
    {
      key: "discountType",
      label: t("columns.discount"),
      render: (item) =>
        item.discountType === "percent"
          ? `${item.discountValue}%`
          : `$${item.discountValue}`,
    },
    {
      key: "minOrderAmount",
      label: t("columns.minOrder"),
      render: (item) => `$${item.minOrderAmount ?? "0"}`,
    },
    {
      key: "usedCount",
      label: t("columns.used"),
      render: (item) => `${item.usedCount ?? 0} / ${item.maxUses ?? "∞"}`,
    },
    {
      key: "endDate",
      label: t("columns.expires"),
      render: (item) =>
        item.endDate ? new Date(item.endDate).toLocaleDateString(locale) : "",
    },
    { key: "isActive", label: t("columns.status"), type: "badge" },
  ];
}

export function getCouponFields(t: Translator): ModalField[] {
  return [
    {
      name: "code",
      label: t("fields.code.label"),
      type: "text",
      placeholder: t("fields.code.placeholder"),
      required: true,
      colSpan: 2,
    },
    {
      name: "discountType",
      label: t("fields.discountType.label"),
      type: "select",
      required: true,
      options: [
        { label: t("fields.discountType.percent"), value: "percent" },
        { label: t("fields.discountType.amount"), value: "amount" },
      ],
    },
    {
      name: "discountValue",
      label: t("fields.discountValue.label"),
      type: "number",
      min: 0.01,
      required: true,
    },
    {
      name: "minOrderAmount",
      label: t("fields.minOrderAmount.label"),
      type: "number",
      min: 0,
    },
    {
      name: "maxUses",
      label: t("fields.maxUses.label"),
      type: "number",
      min: 1,
    },
    { name: "startDate", label: t("fields.startDate.label"), type: "date" },
    { name: "endDate", label: t("fields.endDate.label"), type: "date" },
  ];
}
