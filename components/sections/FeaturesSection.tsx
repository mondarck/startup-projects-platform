'use client';

import { motion } from "framer-motion";

const features = [
  {
    icon: "🔍",
    title: "بحث ذكي",
    description: "ابحث عن المشاريع حسب الكلمات المفتاحية والمجالات",
  },
  {
    icon: "📌",
    title: "حجز مشروع واحد",
    description: "اختر مشروعك المفضل وحجزه باسمك",
  },
  {
    icon: "💾",
    title: "حفظ المشاريع",
    description: "احفظ المشاريع المهمة لمراجعتها لاحقاً",
  },
  {
    icon: "📊",
    title: "إحصائيات",
    description: "اطلع على أحدث الإحصائيات والتقارير",
  },
  {
    icon: "🌐",
    title: "تغطية عالمية",
    description: "مشاريع من أكثر من 50 دولة حول العالم",
  },
  {
    icon: "⭐",
    title: "مشاريع مميزة",
    description: "تصنيفات وتقييمات للمشاريع الأفضل",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            مميزات المنصة
          </h2>
          <p className="text-lg text-gray-600">
            كل ما تحتاجه لاستكشاف واختيار مشروعك المثالي
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-light rounded-xl p-8 hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-dark mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
