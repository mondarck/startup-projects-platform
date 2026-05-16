'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";

// Mock data - في الإنتاج ستأتي من قاعدة البيانات
const mockProjects = [
  {
    id: 1,
    name: "Stripe",
    country: "USA",
    category: "FinTech",
    description: "منصة دفع ذكية توفر بنية تحتية متقدمة لمعالجة المدفوعات عبر الإنترنت",
    image: "🏦",
    rating: 4.8,
    ratingCount: 156,
    views: 2541,
  },
  {
    id: 2,
    name: "OpenAI",
    country: "USA",
    category: "AI",
    description: "منصة الذكاء الاصطناعي الرائدة في العالم مع خدمات متقدمة",
    image: "🤖",
    rating: 4.9,
    ratingCount: 312,
    views: 5000,
  },
  {
    id: 3,
    name: "Tesla",
    country: "USA",
    category: "السيارات الكهربائية",
    description: "شركة رائدة في تصنيع السيارات الكهربائية المستدامة",
    image: "⚡",
    rating: 4.7,
    ratingCount: 234,
    views: 3891,
  },
  {
    id: 4,
    name: "Figma",
    country: "USA",
    category: "تصميم",
    description: "أداة تصميم تعاوني عبر الإنترنت للمنتجات الرقمية",
    image: "🎨",
    rating: 4.6,
    ratingCount: 189,
    views: 2341,
  },
  {
    id: 5,
    name: "Notion",
    country: "USA",
    category: "البرمجيات",
    description: "منصة تعاون وإدارة معرفة متقدمة للفريق والعمل",
    image: "📝",
    rating: 4.5,
    ratingCount: 167,
    views: 2100,
  },
  {
    id: 6,
    name: "Airbnb",
    country: "USA",
    category: "السياحة",
    description: "منصة عالمية لحجز الأماكن والتجارب السياحية",
    image: "🏠",
    rating: 4.4,
    ratingCount: 245,
    views: 3456,
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      project.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ["FinTech", "AI", "السيارات الكهربائية", "تصميم", "البرمجيات", "السياحة"];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-light to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-dark mb-4"
          >
            استكشف المشاريع الناشئة
          </motion.h1>
          <p className="text-gray-600 text-lg">
            ابحث عن أكثر من 3000 مشروع ناشئ ومبتكر
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 mb-12">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Projects Grid */}
          <div className="lg:col-span-3">
            {filteredProjects.length > 0 ? (
              <motion.div
                className="grid md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-dark mb-2">
                  لم يتم العثور على مشاريع
                </h3>
                <p className="text-gray-600">
                  حاول تغيير معايير البحث والفلترة
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
