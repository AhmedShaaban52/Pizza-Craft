import { LayoutDashboard, Users, ShoppingCart, Package, User, ClipboardList, Heart, ShoppingBasket } from "lucide-react";

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

export const NAV_ITEMS = [
  {
    label: { en: "Account Details", ar: "تفاصيل الحساب" },
    href: "/profile",
    icon: User,
  },
  {
    label: { en: "My Orders", ar: "طلباتي" },
    href: "/profile/orders",
    icon: ClipboardList,
  },
  {
    label: { en: "My Favorites", ar: "المفضلة" },
    href: "/profile/wishlist",
    icon: Heart,
  },
  {
    label: { en: "My Cart", href: "/profile/cart", ar: "عربة التسوق" },
    href: "/profile/cart",
    icon: ShoppingBasket,
  },
];
