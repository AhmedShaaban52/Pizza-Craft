import CategoryCard from "./Cards/CategoryCard";

interface Category {
    id: string;
    name: string;
    nameAr?: string | null;
    description: string | null;
    descriptionAr?: string | null;
    image: string;
}

interface CategorySectionProps {
    categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
    if (!categories || categories.length === 0) return null;

    return (
        <div className="px-4 md:px-14 transition-colors duration-300">

            <div className="mb-8 text-left">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
                    Our Main Categories
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                    Chef recommended pairings for your selection
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        id={category.id}
                        name={category.name}
                        nameAr={category.nameAr}
                        description={category.description}
                        descriptionAr={category.descriptionAr}
                        image={category.image}
                    />
                ))}
            </div>
        </div>
    );
}