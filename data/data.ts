import { LayoutDashboard, Users, ShoppingCart, Package } from "lucide-react";

export const links = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    name: "Products",
    icon: Package,
    subItems: [
      { name: "All Products", href: "/admin/products" },
      { name: "Categories", href: "/admin/categories" },
      { name: "Deals & Offers", href: "/admin/offers" },
      { name: "Coupons", href: "/admin/coupons" },
    ],
  },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "USERS", href: "/admin/users", icon: Users },
];
