"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, X } from "lucide-react";
import { searchProducts, type SearchResult } from "@/app/(dashboard)/admin/products/actions";

interface SearchBarProps {
    variant?: "desktop" | "mobile";
    onResultClick?: () => void;
}

export function SearchBar({ variant = "desktop", onResultClick }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const trimmed = query.trim();

        if (!trimmed) {
            return;
        }

        const timeout = setTimeout(() => {
            startTransition(async () => {
                const data = await searchProducts(trimmed);
                setResults(data);
                setOpen(true);
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setQuery(value);

        if (!value.trim()) {
            setResults([]);
            setOpen(false);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        router.push(`/products?search=${encodeURIComponent(trimmed)}`);
        setOpen(false);
        onResultClick?.();
    }

    function clearSearch() {
        setQuery("");
        setResults([]);
        setOpen(false);
    }

    const isDesktop = variant === "desktop";

    return (
        <div ref={containerRef} className={`relative ${isDesktop ? "w-44 focus-within:w-64" : "w-full"} transition-all duration-300`}>
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <Search
                        className={`absolute left-3 ${isDesktop ? "top-2.5" : "top-3"} h-4 w-4 text-neutral-400 dark:text-neutral-500`}
                    />
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        onFocus={() => results.length > 0 && setOpen(true)}
                        placeholder="Search pizzas..."
                        className={`w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 ${isDesktop ? "rounded-full py-1.5" : "rounded-lg py-2"
                            } pl-10 pr-9 text-sm text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className={`absolute right-3 ${isDesktop ? "top-2.5" : "top-3"} text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300`}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </form>

            {open && (
                <div className="absolute left-0 right-0 mt-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
                    {isPending ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                        </div>
                    ) : results.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-center text-neutral-500 dark:text-neutral-400">
                            No products found for &ldquo;{query}&rdquo;
                        </p>
                    ) : (
                        <>
                            <ul className="divide-y divide-neutral-100 dark:divide-neutral-900">
                                {results.map((product) => (
                                    <li key={product.id}>
                                        <Link
                                            href={`/products?search=${encodeURIComponent(product.name)}`}
                                            onClick={() => {
                                                setOpen(false);
                                                onResultClick?.();
                                            }}
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                                        >
                                            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                                    {product.name}
                                                </p>
                                                {product.categoryName && (
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                        {product.categoryName}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                                                ${Number(product.price).toFixed(2)}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={`/products?search=${encodeURIComponent(query)}`}
                                onClick={() => {
                                    setOpen(false);
                                    onResultClick?.();
                                }}
                                className="block text-center text-sm font-medium text-emerald-600 dark:text-emerald-400 py-2.5 border-t border-neutral-100 dark:border-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                            >
                                View all results
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}