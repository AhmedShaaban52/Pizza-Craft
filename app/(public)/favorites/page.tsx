import { getFavorites } from "@/lib/favorites-actions";
import { getCartQuantityForProduct } from "@/lib/cart-actions";
import { FavoriteCard } from "../_components/Cards/FavoriteCard";

export default async function FavoritesPage() {
    const result = await getFavorites();
    const favorites = result.success ? result.data ?? [] : [];

    const cartStates = await Promise.all(
        favorites.map((fav) => getCartQuantityForProduct(fav.product.id))
    );

    return (
        <div className="min-h-screen bg-neutral-950 px-4 md:px-12 py-10">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                    Your <span className="text-emerald-400">Favorites</span>
                </h1>
                <p className="mt-2 text-sm text-neutral-400">
                    Your handpicked artisanal selection
                </p>
            </div>

            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 py-24 text-center">
                    <p className="text-neutral-400">No favorites yet.</p>
                    <p className="text-sm text-neutral-500 mt-1">
                        Tap the heart icon on any product to save it here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {favorites.map((fav, i) => (
                        <FavoriteCard
                            key={fav.id}
                            favorite={fav}
                            cartQuantity={cartStates[i].quantity}
                            cartId={cartStates[i].cartId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}