import { getCartItems } from "@/lib/cart-actions";
import { getFinalPrice } from "@/lib/getFinalPrice";
import { CartItemRow } from "./_components/CartItemRow";
import { CartSummary } from "./_components/CartSummary";

export default async function CartPage() {
    const result = await getCartItems();
    const items = result.success ? result.data ?? [] : [];

    const subtotal = items.reduce((sum, item) => {
        const price = getFinalPrice({
            price: item.product.price,
            discountType: item.product.discountType,
            discountValue: item.product.discountValue,
        });
        return sum + price * item.quantity;
    }, 0);

    return (
        <div className="min-h-screen bg-neutral-950 px-4 md:px-12 py-10">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                    Your <span className="text-emerald-400">Cart</span>
                </h1>
                <p className="mt-2 text-sm text-neutral-400">
                    Review your order before checkout
                </p>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 py-24 text-center">
                    <p className="text-neutral-400">Your cart is empty.</p>
                    <p className="text-sm text-neutral-500 mt-1">
                        Browse the menu and add something delicious.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                    <div className="space-y-4">
                        {items.map((item) => (
                            <CartItemRow key={item.id} item={item} />
                        ))}
                    </div>

                    <CartSummary subtotal={subtotal} />
                </div>
            )}
        </div>
    );
}