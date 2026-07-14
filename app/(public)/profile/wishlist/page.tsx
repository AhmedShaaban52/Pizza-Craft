import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import WishlistClient from "./_components/WishlistClient";
import { getFavorites } from "@/lib/actions/favorites-actions";

export const metadata = {
  title: "Wishlist | Pizza Craft",
};

export default async function FavoritesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const result = await getFavorites();

  if (!result.success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Failed to load wishlist.</p>
      </div>
    );
  }

  return <WishlistClient items={result.data} />;
}
