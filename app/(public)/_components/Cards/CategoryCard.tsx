import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
    id: string;
    name: string;
    description: string | null;
    image: string;
}

export default function CategoryCard({ id, name, description, image }: CategoryCardProps) {
    return (
        <Link
            href={`/products?category=${id}`}
            className="group/category relative rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/15 dark:hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)] flex flex-col overflow-hidden cursor-pointer"
        >
            <div className="relative aspect-4/3 w-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    unoptimized
                    priority
                    className="object-cover transition-transform duration-700 ease-out group-hover/category:scale-105"
                />
            </div>

            <div className="p-5 flex flex-col grow text-left">
                <h3 className="text-md sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight transition-colors duration-300 group-hover/category:text-orange-500!">
                    {name}
                </h3>

                {description && (
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {description}
                    </p>
                )}
            </div>
        </Link>
    );
}