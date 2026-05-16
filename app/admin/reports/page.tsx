'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Reports {
  byFaculty: Array<{ faculty: string; count: number }>;
  byCategory: Array<{ category: string; count: number }>;
  byCountry: Array<{ country: string; count: number }>;
  recentReservations: Array<{
    id: string;
    reservedAt: string;
    user: { firstName: string; lastName: string; faculty: { nameAr: string } };
    project: { nameAr: string; number: number; categoryAr: string };
  }>;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Reports | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then((d) => { if (d.success) setReports(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!reports) return <div className="text-red-500 text-center">فشل تحميل التقارير</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-8">التقارير والإحصائيات</h1>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* By Faculty */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-dark mb-4">الطلبة حسب الكلية</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reports.byFaculty} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="faculty" tick={{ fontSize: 10 }} width={130} />
              <Tooltip />
              <Bar dataKey="count" fill="#00CC88" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* By Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-dark mb-4">المشاريع حسب المجال</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reports.byCategory.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0066FF" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* By Country */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm mb-6"
      >
        <h2 className="text-lg font-bold text-dark mb-4">المشاريع حسب الدولة (أعلى 10)</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {reports.byCountry.map((c, i) => (
            <div key={i} className="bg-light rounded-lg p-3 text-center">
              <div className="font-bold text-dark">{c.count}</div>
              <div className="text-xs text-gray-500">{c.country}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Reservations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-dark">آخر الحجوزات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3 text-right">الطالب</th>
                <th className="px-4 py-3 text-right">الكلية</th>
                <th className="px-4 py-3 text-right">المشروع</th>
                <th className="px-4 py-3 text-right">المجال</th>
                <th className="px-4 py-3 text-right">تاريخ الحجز</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.recentReservations.map((r) => (
                <tr key={r.id} className="hover:bg-light transition">
                  <td className="px-4 py-3 font-semibold text-dark">{r.user.firstName} {r.user.lastName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.user.faculty.nameAr}</td>
                  <td className="px-4 py-3 text-sm">#{r.project.number} {r.project.nameAr}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.project.categoryAr}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(r.reservedAt).toLocaleDateString("ar-DZ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.recentReservations.length === 0 && (
            <div className="text-center py-8 text-gray-400">لا توجد حجوزات</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
