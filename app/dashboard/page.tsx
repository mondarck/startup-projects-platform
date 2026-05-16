'use client';

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface Reservation {
  id: string;
  projectId: number;
  reservedAt: string;
  status: string;
  project: {
    nameAr: string;
    categoryAr: string;
    number: number;
    status: string;
  };
}

interface SavedProject {
  id: string;
  projectId: number;
  savedAt: string;
  project: {
    nameAr: string;
    categoryAr: string;
    status: string;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "student") {
      router.push("/auth/login");
      return;
    }
    loadData();
  }, [session, status]);

  async function loadData() {
    const [resData, savedData] = await Promise.all([
      fetch("/api/reservations").then((r) => r.json()),
      fetch("/api/saved-projects").then((r) => r.json()),
    ]);
    if (resData.success) setReservation(resData.data);
    if (savedData.success) setSavedProjects(savedData.data);
    setLoading(false);
  }

  async function handleUnsave(projectId: number) {
    await fetch("/api/saved-projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });
    setSavedProjects((prev) => prev.filter((s) => s.projectId !== projectId));
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-dark">
              مرحباً، {session.user.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-500 mt-1">{session.user.facultyName}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/projects" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
              استكشف المشاريع
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-white transition"
            >
              خروج
            </button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "المشروع المحجوز", value: reservation ? "1" : "0", color: "bg-primary", icon: "📌" },
            { label: "المحفوظات", value: savedProjects.length.toString(), color: "bg-secondary", icon: "❤️" },
            { label: "الحالة", value: "نشط", color: "bg-accent", icon: "✅" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-dark">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Reservation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-dark mb-4">مشروعك المحجوز</h2>

          {reservation ? (
            <div className="flex items-center justify-between p-4 bg-secondary-light rounded-xl">
              <div>
                <h3 className="text-lg font-bold text-dark">{reservation.project.nameAr}</h3>
                <p className="text-gray-500 text-sm">
                  {reservation.project.categoryAr} • رقم {reservation.project.number}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  تم الحجز: {formatDate(reservation.reservedAt)}
                </p>
              </div>
              <Link
                href={`/projects/${reservation.projectId}`}
                className="px-4 py-2 bg-secondary text-white rounded-lg text-sm hover:bg-secondary-dark transition"
              >
                عرض المشروع
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 mb-4">لم تقم بحجز أي مشروع بعد</p>
              <Link href="/projects" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                ابحث عن مشروع
              </Link>
            </div>
          )}
        </motion.div>

        {/* Saved Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-dark">المشاريع المحفوظة ({savedProjects.length})</h2>
          </div>

          {savedProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {savedProjects.map((saved) => (
                <div key={saved.id} className="flex items-center justify-between p-4 bg-light rounded-xl">
                  <div>
                    <h4 className="font-semibold text-dark">{saved.project.nameAr}</h4>
                    <p className="text-sm text-gray-500">{saved.project.categoryAr}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/projects/${saved.projectId}`}
                      className="px-3 py-1 bg-primary-light text-primary rounded-lg text-sm hover:bg-primary hover:text-white transition"
                    >
                      عرض
                    </Link>
                    <button
                      onClick={() => handleUnsave(saved.projectId)}
                      className="px-3 py-1 text-red-400 hover:bg-red-50 rounded-lg text-sm transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🔖</div>
              <p className="text-gray-500">لا توجد مشاريع محفوظة</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
