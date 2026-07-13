import { getTranslations } from "next-intl/server";
import { getCoupons } from "./actions";
import { CouponsTable } from "./_components/CouponsTable";

export default async function CouponsPage() {
    const t = await getTranslations("Coupons");
    const result = await getCoupons();
    const coupons = result.success ? result.data ?? [] : [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {t("pageTitle")}
            </h1>

            <CouponsTable coupons={coupons} />
        </div>
    );
}