import { ProductWithCategory } from "@/utils/ProductsFields";

export function getFinalPrice(product: ProductWithCategory): number {
    const base = Number(product.price);
    if (!product.discountType || !product.discountValue) return base;
    const discount = Number(product.discountValue);
    return product.discountType === "percent"
        ? base - (base * discount) / 100
        : Math.max(0, base - discount);
}