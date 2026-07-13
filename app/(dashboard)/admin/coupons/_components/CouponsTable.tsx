"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "@/context/locale-context";
import { EntityTable } from "../../../_components/EntityTable";
import { createCoupon, deleteCoupon, updateCoupon } from "../actions";
import { getCouponColumns, getCouponFields } from "@/utils/CouponsFields";
import { type Coupon } from "@/lib/types";

interface CouponsTableProps {
    coupons: Coupon[];
}

export function CouponsTable({ coupons }: CouponsTableProps) {
    const t = useTranslations("Coupons");
    const { locale } = useLocale();

    return (
        <EntityTable<Coupon>
            title={t("entityName")}
            items={coupons}
            columns={getCouponColumns(t, locale)}
            fields={getCouponFields(t)}
            onCreate={createCoupon}
            onUpdate={updateCoupon}
            onDelete={deleteCoupon}
            nameKey="code"
        />
    );
}