"use client";

import { EntityTable } from "../../../_components/EntityTable";
import { createCoupon, deleteCoupon, updateCoupon } from "../actions";
import { couponColumns, couponFields } from "@/utils/CouponsFields";
import { type Coupon } from "@/lib/types";

interface CouponsTableProps {
    coupons: Coupon[];
}

export function CouponsTable({ coupons }: CouponsTableProps) {
    return (
        <EntityTable<Coupon>
            title="Coupon"
            items={coupons}
            columns={couponColumns}
            fields={couponFields}
            onCreate={createCoupon}
            onUpdate={updateCoupon}
            onDelete={deleteCoupon}
        />
    );
}