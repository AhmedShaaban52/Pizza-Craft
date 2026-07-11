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

export const NavLinks = [
  { name: { en: "Home", ar: "الرئيسية" }, href: "/" },
  { name: { en: "Products", ar: "المنتجات" }, href: "/products" },
  { name: { en: "About Us", ar: "من نحن" }, href: "/about" },
  { name: { en: "Contact", ar: "اتصل بنا" }, href: "/contact" },
];