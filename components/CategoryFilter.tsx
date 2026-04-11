"use client";

import { useRouter } from "next/navigation";
import type { WPCategory } from "@/lib/api";

interface CategoryFilterProps {
  categories: WPCategory[];
  activeCategory?: number;
}

export default function CategoryFilter({
  categories,
  activeCategory,
}: CategoryFilterProps) {
  const router = useRouter();

  const handleSelect = (categoryId?: number) => {
    if (categoryId) {
      router.push(`/?category=${categoryId}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="sticky top-[73px] z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="flex gap-2 overflow-x-auto py-3 scrollbar-hide"
          role="navigation"
          aria-label="Filtrer par catégorie"
        >
          <button
            onClick={() => handleSelect()}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
              !activeCategory
                ? "bg-[#8B0000] text-white border-[#8B0000] shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#8B0000] hover:text-[#8B0000]"
            }`}
          >
            Tout
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                activeCategory === cat.id
                  ? "bg-[#8B0000] text-white border-[#8B0000] shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#8B0000] hover:text-[#8B0000]"
              }`}
            >
              {cat.name}
              <span
                className={`ml-1.5 text-xs ${
                  activeCategory === cat.id ? "opacity-70" : "opacity-50"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
