import { getCoupons } from "./actions";
import { CouponsTable } from "./_components/CouponsTable";

export default async function CouponsPage() {
    const result = await getCoupons();
    const coupons = result.success ? result.data ?? [] : [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Coupons
            </h1>

            <CouponsTable coupons={coupons} />
        </div>
    );
}