'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary-dark text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          جاهز لاستكشاف المشاريع؟
        </h2>
        <p className="text-lg text-blue-100 mb-8 leading-relaxed">
          انضم إلى آلاف الطلبة في استكشاف أفكار المشاريع المبتكرة والملهمة
        </p>

        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <Link
            href="/signup"
            className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            تسجيل جديد
          </Link>
          <Link
            href="/projects"
            className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition"
          >
            استكشف الآن
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
