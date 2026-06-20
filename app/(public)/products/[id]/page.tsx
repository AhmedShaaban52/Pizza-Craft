import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductById, getProducts } from "@/app/(dashboard)/admin/products/actions";
import { getFinalPrice } from "@/lib/getFinalPrice";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { type ProductWithCategory } from "@/utils/ProductsFields";
import { ProductGridCard } from "../_components/ProductGridCard";

interface ProductDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
    const { id } = await params;

    const [productResult, allProductsResult] = await Promise.all([
        getProductById(id),
        getProducts(),
    ]);

    if (!productResult.success || !productResult.data) {
        notFound();
    }

    const product = productResult.data;
    const finalPrice = getFinalPrice(product);
    const hasDiscount = !!product.discountType && !!product.discountValue;

    const allProducts = (allProductsResult.success ? allProductsResult.data ?? [] : []) as ProductWithCategory[];
    const relatedProducts = allProducts
        .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="px-4 md:px-12 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        priority
                        className="object-cover"
                    />
                    {hasDiscount && (
                        <span className="absolute top-4 left-4 rounded-full bg-emerald-500 text-black text-sm font-semibold px-3 py-1.5">
                            {product.discountType === "percent"
                                ? `-${product.discountValue}%`
                                : `-$${product.discountValue}`}
                        </span>
                    )}
                </div>

                {/* Details */}
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                        {product.name}
                    </h1>

                    {product.description && (
                        <p className="mt-3 text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            {product.description}
                        </p>
                    )}

                    <div className="mt-6 flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                            ${finalPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-lg text-neutral-400 line-through">
                                ${Number(product.price).toFixed(2)}
                            </span>
                        )}
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                        <Button className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Add to Cart
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 border-neutral-300 dark:border-neutral-700"
                        >
                            <Heart className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Related products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                        You might also like
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductGridCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}