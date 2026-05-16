'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-white px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6 leading-tight">
            اكتشف أفكار المشاريع المبتكرة
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            منصة متخصصة لاستكشاف وحجز المشاريع الناشئة المبتكرة لإلهام مشاريعك الأكاديمية والمستقبلية
          </p>

          <div className="flex gap-4 flex-col sm:flex-row">
            <Link
              href="/projects"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition text-center"
            >
              استكشف المشاريع
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary-light transition text-center"
            >
              تعرّف علينا
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12 pt-8 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold text-primary">3000+</div>
              <div className="text-gray-600">مشروع ناشئ</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">8</div>
              <div className="text-gray-600">كليات</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-gray-600">دولة</div>
            </div>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex justify-center"
        >
          <div className="relative w-full h-96 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-2xl flex items-center justify-center">
            <div className="text-6xl">🚀</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
