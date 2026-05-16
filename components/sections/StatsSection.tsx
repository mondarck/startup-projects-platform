'use client';

import { motion } from "framer-motion";

export function StatsSection() {
  const stats = [
    { label: "المشاريع الكلية", value: "3,000+", color: "from-primary" },
    { label: "المشاريع المتاحة", value: "1,856", color: "from-secondary" },
    { label: "الطلبة المسجلين", value: "5,000+", color: "from-accent" },
    { label: "الحجوزات النشطة", value: "245", color: "from-purple-600" },
  ];

  return (
    <section className="py-20 px-4 bg-dark text-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          إحصائيات المنصة
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} to-transparent rounded-xl p-8 text-center`}
            >
              <motion.div
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {stat.value}
              </motion.div>
              <p className="text-gray-200">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
