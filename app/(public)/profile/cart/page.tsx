import { requireUser } from "@/lib/requireUser";
import { getCartItems } from "@/lib/cart-actions";
import CartClient from "./_components/CartClient";

export const revalidate = 0;

export default async function CartPage() {
  await requireUser();

  const result = await getCartItems();
  const items = result.success ? result.data ?? [] : [];

  return <CartClient items={items} />;
}
