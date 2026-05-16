'use client';

import { motion } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-4">
        <span className="text-2xl">🔍</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ابحث عن مشروع أو كلمة مفتاحية..."
          className="flex-1 outline-none text-dark"
        />
        <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition">
          بحث
        </button>
      </div>
    </motion.div>
  );
}
