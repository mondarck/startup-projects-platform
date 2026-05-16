'use client';

import { motion } from "framer-motion";

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
}: FilterSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-light rounded-lg p-6 h-fit sticky top-24"
    >
      <h3 className="text-lg font-bold text-dark mb-4">التصفية</h3>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold text-dark mb-3">المجالات</h4>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange("all")}
            className={`block w-full text-right px-4 py-2 rounded-lg transition ${
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "text-dark hover:bg-white"
            }`}
          >
            جميع المجالات
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`block w-full text-right px-4 py-2 rounded-lg transition ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "text-dark hover:bg-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="border-t border-gray-300 pt-6">
        <h4 className="font-semibold text-dark mb-3">المزيد من الفلاتر</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm text-dark">الأفضل تقييماً</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm text-dark">الأكثر مشاهدة</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm text-dark">الجديد</span>
          </label>
        </div>
      </div>
    </motion.div>
  );
}
