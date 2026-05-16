'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  totalProjects: number;
  availableProjects: number;
  reservedProjects: number;
  totalReservations: number;
  recentActivity: Array<{
    id: number;
    actionType: string;
    description: string;
    createdAt: string;
    user?: { firstName: string; lastName: string } | null;
    admin?: { fullName: string } | null;
  }>;
  categoryStats: Array<{ category: string; count: number }>;
}

const COLORS = ["#0066FF", "#00CC88", "#FF9900", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) return <div className="text-center text-red-500">فشل تحميل الإحصائيات</div>;

  const statCards = [
    { label: "إجمالي الطلبة", value: stats.totalUsers, icon: "👥", color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
    { label: "الحسابات النشطة", value: stats.activeUsers, icon: "✅", color: "bg-green-50 text-green-600", border: "border-green-200" },
    { label: "في انتظار التفعيل", value: stats.pendingUsers, icon: "⏳", color: "bg-yellow-50 text-yellow-600", border: "border-yellow-200" },
    { label: "المشاريع المتاحة", value: stats.availableProjects, icon: "📦", color: "bg-purple-50 text-purple-600", border: "border-purple-200" },
    { label: "المشاريع المحجوزة", value: stats.reservedProjects, icon: "📌", color: "bg-orange-50 text-orange-600", border: "border-orange-200" },
    { label: "الحجوزات النشطة", value: stats.totalReservations, icon: "🎯", color: "bg-red-50 text-red-600", border: "border-red-200" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-8">لوحة المراقبة</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white rounded-xl p-6 border-2 ${card.border} shadow-sm`}
          >
            <div className="flex items-center gap-4">
              <div className={`text-3xl p-3 rounded-lg ${card.color}`}>{card.icon}</div>
              <div>
                <div className="text-2xl font-bold text-dark">{card.value.toLocaleString()}</div>
                <div className="text-gray-500 text-sm">{card.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Category Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-dark mb-4">توزيع المشاريع حسب المجال</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.categoryStats.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0066FF" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-dark mb-4">المجالات الأكثر طلباً</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.categoryStats.slice(0, 6)}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.categoryStats.slice(0, 6).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-bold text-dark mb-4">آخر الأنشطة</h2>
        {stats.recentActivity.length === 0 ? (
          <p className="text-gray-400 text-center py-4">لا توجد أنشطة</p>
        ) : (
          <div className="space-y-3">
            {stats.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-light transition">
                <div className="text-2xl">
                  {activity.actionType.includes("RESERVE") ? "📌" : activity.actionType.includes("USER") ? "👤" : "📦"}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-dark">{activity.description ?? activity.actionType}</p>
                  <p className="text-xs text-gray-400">
                    {activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : activity.admin?.fullName ?? "النظام"}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(activity.createdAt).toLocaleDateString("ar-DZ")}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
