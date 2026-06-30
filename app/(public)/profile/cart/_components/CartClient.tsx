"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Zap } from "lucide-react";
import {
  updateCartQuantity,
  removeFromCart,
} from "@/lib/cart-actions";
import { createCheckoutSession } from "@/lib/actions/checkoutActions";
import { AddToCartButton } from "@/app/(public)/products/_components/AddToCartButton";

interface CartProduct {
  id: string;
  name: string;
  image: string;
  price: string;
  discountType?: string | null;
  discountValue?: string | null;
}

interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
  category: { name: string | null } | null;
}

function getFinalPrice(product: CartProduct): number {
  const price = parseFloat(product.price);
  if (!product.discountType || !product.discountValue) return price;
  const discount = parseFloat(product.discountValue);
  if (product.discountType === "percent") return price - (price * discount) / 100;
  if (product.discountType === "amount") return Math.max(0, price - discount);
  return price;
}

export default function CartClient({ items }: { items: CartItem[] }) {
  const [list, setList] = useState<CartItem[]>(items);
  const [isPending, startTransition] = useTransition();
  const [checkingOut, setCheckingOut] = useState(false);

  function handleQuantityChange(cartId: string, newQty: number) {
    setList((prev) =>
      prev.map((item) =>
        item.id === cartId ? { ...item, quantity: Math.max(1, newQty) } : item,
      ),
    );
    startTransition(async () => {
      await updateCartQuantity(cartId, Math.max(1, newQty));
    });
  }

  function handleRemove(cartId: string) {
    setList((prev) => prev.filter((item) => item.id !== cartId));
    startTransition(async () => {
      await removeFromCart(cartId);
    });
  }

  async function handleCheckout() {
    setCheckingOut(true);
    const res = await createCheckoutSession();
    if (res.url) {
      window.location.href = res.url;
    } else {
      setCheckingOut(false);
    }
  }

  const subtotal = list.reduce(
    (sum, item) => sum + getFinalPrice(item.product) * item.quantity,
    0,
  );
  const deliveryFee = list.length > 0 ? 5.5 : 0;
  const estimatedTax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + deliveryFee + estimatedTax).toFixed(2);

  if (list.length === 0) {
    return (
      <div className="min-h-[75vh] bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center gap-6 px-4">
        <ShoppingBag className="w-20 h-20 text-neutral-300 dark:text-neutral-700" />
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Your cart is empty</h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-sm">
          Browse our menu and add some wood-fired favorites to get started.
        </p>
        <Link
          href="/products"
          className="bg-orange-500 hover:bg-orange-600 text-white dark:text-black font-bold px-6 py-3 rounded-xl transition-colors"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 md:px-12 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-neutral-900 dark:text-white">
          Your <span className="text-orange-500">Cart</span>
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">
          {list.length} item{list.length !== 1 ? "s" : ""} ready for the hearth.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items list */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800 shadow-sm">
          {list.map((item) => {
            const finalPrice = getFinalPrice(item.product);
            const hasDiscount =
              item.product.discountType && item.product.discountValue;

            return (
              <div key={item.id} className="p-5 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-neutral-400 dark:text-neutral-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-neutral-900 dark:text-white text-base truncate">
                    {item.product.name}
                  </h3>
                  {item.category?.name && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {item.category.name}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {hasDiscount && (
                      <span className="text-neutral-400 dark:text-neutral-600 line-through text-xs">
                        ${Number(item.product.price).toFixed(2)}
                      </span>
                    )}
                    <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">
                      ${finalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="w-28">
                  <AddToCartButton
                    productId={item.product.id}
                  />
                </div>


                <div className="text-right shrink-0 w-20">
                  <p className="font-black text-neutral-900 dark:text-white">
                    ${(finalPrice * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={isPending}
                  aria-label="Remove item"
                  className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-red-500 dark:text-neutral-600 dark:hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 h-fit shadow-sm">
          <h3 className="text-base font-black text-neutral-900 dark:text-white mb-4">Order Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Subtotal</span>
              <span className="text-neutral-800 dark:text-neutral-300 font-semibold">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Delivery Fee</span>
              <span className="text-neutral-800 dark:text-neutral-300 font-semibold">
                ${deliveryFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Estimated Tax</span>
              <span className="text-neutral-800 dark:text-neutral-300 font-semibold">
                ${estimatedTax.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 mt-4 pt-4">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
              Total
            </p>
            <p className="text-3xl font-black text-neutral-900 dark:text-white">${total.toFixed(2)}</p>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkingOut || list.length === 0}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white dark:text-black font-black py-3 rounded-xl transition-colors text-sm disabled:opacity-60"
          >
            {checkingOut ? "Redirecting…" : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}