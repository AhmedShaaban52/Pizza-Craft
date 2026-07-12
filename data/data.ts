import { LayoutDashboard, Users, ShoppingCart, Package } from "lucide-react";

export const links = [
  {
    id: "dashboard",
    nameKey: "dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    id: "products",
    nameKey: "products",
    icon: Package,
    subItems: [
      { id: "allProducts", nameKey: "allProducts", href: "/admin/products" },
      { id: "categories", nameKey: "categories", href: "/admin/categories" },
      { id: "dealsOffers", nameKey: "dealsOffers", href: "/admin/offers" },
      { id: "coupons", nameKey: "coupons", href: "/admin/coupons" },
    ],
  },
  {
    id: "orders",
    nameKey: "orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  { id: "users", nameKey: "users", href: "/admin/users", icon: Users },
];

export const NavLinks = [
  { name: { en: "Home", ar: "الرئيسية" }, href: "/" },
  { name: { en: "Products", ar: "المنتجات" }, href: "/products" },
  { name: { en: "About Us", ar: "من نحن" }, href: "/about" },
  { name: { en: "Contact", ar: "اتصل بنا" }, href: "/contact" },
];
