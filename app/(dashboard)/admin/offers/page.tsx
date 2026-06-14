import { getOffers } from "./actions";
import { OffersTable } from "./_components/OffersTable";

export default async function OffersPage() {
    const result = await getOffers();
    const offers = result.success ? result.data ?? [] : [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Offers
            </h1>

            <OffersTable offers={offers} />
        </div>
    );
}