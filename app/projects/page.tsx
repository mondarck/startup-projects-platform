'use client';

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Project {
  id: number;
  number: number;
  nameAr: string;
  country: string | null;
  categoryAr: string;
  descriptionAr: string;
  status: string;
  viewsCount: number;
  savedCount: number;
  rating: number;
}

const CATEGORIES_API = "/api/projects/categories";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch categories & countries once
  useEffect(() => {
    fetch("/api/projects/categories")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setCategories(d.data.categories);
          setCountries(d.data.countries);
        }
      });
  }, []);

  // Fetch projects
  const loadProjects = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "18", status: "all" });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedCountry) params.set("country", selectedCountry);
    if (sort) params.set("sort", sort);

    const res = await fetch(`/api/projects?${params}`);
    const data = await res.json();
    if (data.success) {
      setProjects(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    }
    setLoading(false);
  }, [page, debouncedSearch, selectedCategory, selectedCountry, sort]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  function resetFilters() {
    setSearch(""); setSelectedCategory(""); setSelectedCountry(""); setSort("relevance"); setPage(1);
  }

  const categoryIcons: Record<string, string> = {
    "FinTech": "💳", "الذكاء الاصطناعي": "🤖", "الصحة": "🏥", "التعليم": "📚",
    "الطاقة": "⚡", "التجارة الإلكترونية": "🛒", "السياحة": "✈️", "الزراعة": "🌾",
    "البرمجيات": "💻", "تصميم": "🎨", "الأمن": "🔒", "النقل": "🚗",
    "الترفيه": "🎬", "اللوجستيات": "📦", "العقارات": "🏠",
  };

  function getIcon(category: string) {
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (category.includes(key)) return icon;
    }
    return "🚀";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            استكشف المشاريع الناشئة
          </motion.h1>
          <p className="text-blue-100 text-lg mb-8">
            {total > 0 ? `${total.toLocaleString("ar-DZ")} مشروع ناشئ من حول العالم` : "جاري التحميل..."}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث باسم الشركة، المجال، الدولة، أو وصف النشاط..."
              className="w-full px-6 py-4 rounded-2xl text-dark text-lg focus:outline-none shadow-xl pr-14"
            />
            <span className="absolute top-1/2 right-5 -translate-y-1/2 text-2xl">🔍</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8 flex-col lg:flex-row">

          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-dark text-lg">التصفية</h3>
                <button onClick={resetFilters} className="text-xs text-primary hover:underline">
                  إعادة تعيين
                </button>
              </div>

              {/* Sort */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-dark mb-2">الترتيب</label>
                <select
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                >
                  <option value="relevance">الافتراضي</option>
                  <option value="newest">الأحدث</option>
                  <option value="most_viewed">الأكثر مشاهدة</option>
                  <option value="rating">الأعلى تقييماً</option>
                </select>
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-dark mb-2">المجال</label>
                <div className="space-y-1 max-h-52 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedCategory(""); setPage(1); }}
                    className={`w-full text-right px-3 py-2 rounded-lg text-sm transition ${!selectedCategory ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-700"}`}
                  >
                    جميع المجالات
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setPage(1); }}
                      className={`w-full text-right px-3 py-2 rounded-lg text-sm transition ${selectedCategory === cat ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-700"}`}
                    >
                      {getIcon(cat)} {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country */}
              {countries.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">الدولة</label>
                  <select
                    value={selectedCountry}
                    onChange={e => { setSelectedCountry(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="">جميع الدول</option>
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </aside>

          {/* Projects Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                    <div className="h-24 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-dark mb-2">لا توجد نتائج</h3>
                <p className="text-gray-500 mb-4">جرّب كلمات بحث مختلفة أو غيّر الفلاتر</p>
                <button onClick={resetFilters} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                  عرض جميع المشاريع
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-5">
                  <p className="text-gray-500 text-sm">
                    عرض <span className="font-semibold text-dark">{projects.length}</span> من أصل <span className="font-semibold text-dark">{total.toLocaleString("ar-DZ")}</span> مشروع
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={page + debouncedSearch + selectedCategory}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid md:grid-cols-2 xl:grid-cols-3 gap-5"
                  >
                    {projects.map((project, i) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link href={`/projects/${project.id}`}>
                          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col cursor-pointer group">
                            {/* Card Top */}
                            <div className="bg-gradient-to-br from-primary-light to-blue-50 p-6 flex items-center justify-center h-28">
                              <span className="text-5xl">{getIcon(project.categoryAr)}</span>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex flex-col flex-1">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <h3 className="font-bold text-dark text-lg leading-tight group-hover:text-primary transition">
                                  {project.nameAr}
                                </h3>
                                {project.status === "reserved" && (
                                  <span className="shrink-0 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">محجوز</span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                <span className="bg-primary-light text-primary px-2 py-0.5 rounded-full font-medium">
                                  {project.categoryAr}
                                </span>
                                {project.country && <span>🌍 {project.country}</span>}
                              </div>

                              {/* Description */}
                              <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">
                                {project.descriptionAr}
                              </p>

                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                                <span>👁 {project.viewsCount.toLocaleString()}</span>
                                <span className="text-primary font-semibold text-sm">عرض التفاصيل ←</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-5 py-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition"
                    >
                      السابق
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-lg font-semibold transition ${p === page ? "bg-primary text-white shadow" : "hover:bg-white border border-gray-200"}`}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-5 py-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition"
                    >
                      التالي
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
