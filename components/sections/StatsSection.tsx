'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function StatsSection() {
  const [totalProjects, setTotalProjects] = useState<number | null>(null);
  const [availableProjects, setAvailableProjects] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setTotalProjects(d.data.totalProjects);
          setAvailableProjects(d.data.availableProjects);
        }
      })
      .catch(() => {});
  }, []);

  const items = [
    { label: "المشاريع الكلية", value: totalProjects !== null ? totalProjects.toLocaleString("ar-DZ") : "…", color: "from-primary", icon: "🚀" },
    { label: "المشاريع المتاحة للحجز", value: availableProjects !== null ? availableProjects.toLocaleString("ar-DZ") : "…", color: "from-secondary", icon: "✅" },
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

        <div className="flex justify-center gap-10 flex-wrap">
          {items.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`bg-gradient-to-br ${stat.color} to-transparent rounded-2xl p-12 text-center min-w-[260px]`}
            >
              <div className="text-5xl mb-4">{stat.icon}</div>
              <motion.div
                className="text-5xl font-bold mb-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.2 }}
              >
                {stat.value}
              </motion.div>
              <p className="text-gray-200 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
