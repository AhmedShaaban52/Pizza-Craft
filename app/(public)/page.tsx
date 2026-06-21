import { offersTable, categoriesTable, productsTable } from "@/lib/schema"; 
import OfferSlider from "./_components/OfferSlider";
import CategorySection from "./_components/CategorySection";
import { and, lte, gte, or, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import BestSellerSection from "./_components/BestSellerSection";

async function getActiveOffers() {
  const now = new Date();
  return await db
    .select()
    .from(offersTable)
    .where(
      and(
        or(isNull(offersTable.startDate), lte(offersTable.startDate, now)),
        or(isNull(offersTable.endDate), gte(offersTable.endDate, now))
      )
    );
}

async function getCategories() {
  return await db.select().from(categoriesTable);
}

async function getFeaturedProducts() {
  return await db
    .select()
    .from(productsTable) 
    .limit(4); 
}

export default async function HomePage() {
  const activeOffers = await getActiveOffers();
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts(); 

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <OfferSlider offers={activeOffers} />

      <CategorySection categories={categories} />

      <BestSellerSection
        products={featuredProducts}
        title="You might also like"
        subtitle="Chef recommended pairings for your selection"
      />
    </div>
  );
}