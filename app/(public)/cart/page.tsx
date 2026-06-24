import { getCartItems } from "@/lib/cart-actions";
import { requireUser } from "@/lib/requireUser";
import { CartClient } from "./_components/CartClient";

export default async function CartPage() {
    await requireUser();
    const result = await getCartItems();
    const items = result.success ? result.data ?? [] : [];

    const subtotal = items.reduce((sum, item) => {
        let price = parseFloat(item.product.price);
        if (item.product.discountType && item.product.discountValue) {
            const d = parseFloat(item.product.discountValue);
            price = item.product.discountType === "percent"
                ? price - (price * d) / 100
                : Math.max(0, price - d);
        }
        return sum + price * item.quantity;
    }, 0);

    return <CartClient initialItems={items} subtotal={subtotal} />;
}