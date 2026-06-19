
import Image from "next/image";

interface CategoryCardProps {
    name: string;
    description: string | null;
    image: string;
}

export default function CategoryCard({ name, description, image }: CategoryCardProps) {
    return (
        <div className="group relative rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 transition-all duration-500 hover:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(16,185,129,0.08)] flex flex-col overflow-hidden cursor-pointer">

            <div className="relative aspect-4/3 w-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    unoptimized
                    priority
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
            </div>

            <div className="p-5 flex flex-col grow text-left">
                <h3 className="text-md sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight transition-colors duration-300 group-hover:text-emerald-500">
                    {name}
                </h3>

                {description && (
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}