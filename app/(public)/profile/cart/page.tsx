import { requireUser } from "@/lib/requireUser";
import CartClient from "./_components/CartClient";
import { getCartItems } from "@/lib/actions/cart-actions";

export const revalidate = 0;

export default async function CartPage() {
  await requireUser();

  const result = await getCartItems();
  const items = result.success ? result.data ?? [] : [];

  return <CartClient items={items} />;
}
