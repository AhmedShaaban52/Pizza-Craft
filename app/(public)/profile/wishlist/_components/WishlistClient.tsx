"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import WishlistCard from "./WishlistCard";
import { getFavorites } from "@/lib/actions/favorites-actions";

export type WishlistItem = Awaited<
  ReturnType<typeof getFavorites>
>["data"] extends infer D ? (D extends Array<infer I> ? I : never) : never;

type SortKey = "default" | "price-asc" | "price-desc" | "name";

export default function WishlistClient({ items }: { items: WishlistItem[] }) {
  const t = useTranslations("Wishlist");
  const [sort, setSort] = useState<SortKey>("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [list, setList] = useState<WishlistItem[]>(items);

  function handleRemove(id: string) {
    setList((prev) => prev.filter((item) => item.id !== id));
  }

  const sorted = [...list].sort((a, b) => {
    if (sort === "price-asc") return Number(a.product.price) - Number(b.product.price);
    if (sort === "price-desc") return Number(b.product.price) - Number(a.product.price);
    if (sort === "name") return a.product.name.localeCompare(b.product.name);
    return 0;
  });

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "default", label: t("sortDefault") },
    { key: "price-asc", label: t("sortPriceAsc") },
    { key: "price-desc", label: t("sortPriceDesc") },
    { key: "name", label: t("sortName") },
  ];

  return (
    <div className="md:min-h-screen bg-background text-foreground px-6 md:px-12 py-10 md:pt-24">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-1">
            {t("yourCollection")}
          </p>
          <h1 className="text-lg md:text-4xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-sm">
            {t("subtitle")}
          </p>
        </div>

        {/* Sort */}
        <div className="relative shrink-0 mt-1">
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {t("sortBy")}
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-lg z-10 overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { setSort(opt.key); setSortOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted
                    ${sort === opt.key ? "text-orange-500 font-medium" : "text-foreground"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-4xl mb-4">🍕</p>
          <p className="text-lg font-semibold">{t("emptyTitle")}</p>
          <p className="text-muted-foreground text-sm mt-1">
            {t("emptySubtitle")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((item) => (
            <WishlistCard key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}