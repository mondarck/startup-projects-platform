'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate, getStatusLabel } from "@/lib/utils";

interface Project {
  id: number;
  number: number;
  nameAr: string;
  nameEn?: string;
  country?: string;
  categoryAr: string;
  descriptionAr: string;
  status: string;
  isFeatured: boolean;
  viewsCount: number;
  savedCount: number;
  rating: number;
  createdAt: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasReservation, setHasReservation] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/projects/${id}`);
      const json = await res.json();
      if (json.success) setProject(json.data);
      setLoading(false);
    }
    load();
  }, [id]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/reservations")
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data) setHasReservation(true); });
  }, [session]);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleReserve() {
    if (!session) return router.push("/auth/login");
    setReserving(true);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project?.id }),
    });
    const data = await res.json();
    if (data.success) {
      setHasReservation(true);
      if (project) setProject({ ...project, status: "reserved" });
      showToast("تم حجز المشروع بنجاح!", "success");
    } else {
      showToast(data.error ?? "حدث خطأ", "error");
    }
    setReserving(false);
  }

  async function handleSave() {
    if (!session) return router.push("/auth/login");
    setSaving(true);
    const res = await fetch("/api/saved-projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project?.id }),
    });
    const data = await res.json();
    if (data.success) {
      setIsSaved(data.saved);
      showToast(data.message, "success");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-dark mb-2">المشروع غير موجود</h2>
          <Link href="/projects" className="text-primary hover:underline">العودة للمشاريع</Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusLabel(project.status);
  const statusColors: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all ${toast.type === "success" ? "bg-secondary" : "bg-red-500"}`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Back */}
        <Link href="/projects" className="flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition">
          ← العودة للمشاريع
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-primary to-primary-dark p-10 text-white text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h1 className="text-3xl font-bold">{project.nameAr}</h1>
                {project.nameEn && <p className="text-blue-200 mt-1">{project.nameEn}</p>}
              </div>

              <div className="p-8">
                {/* Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm font-semibold">
                    {project.categoryAr}
                  </span>
                  {project.country && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {project.country}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[statusInfo.color] ?? "bg-gray-100 text-gray-700"}`}>
                    {statusInfo.label}
                  </span>
                  {project.isFeatured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      ⭐ مميز
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-dark mb-3">وصف المشروع</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">{project.descriptionAr}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-light rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{project.viewsCount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">مشاهدة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{project.savedCount}</div>
                    <div className="text-sm text-gray-500">محفوظة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{project.rating.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">تقييم</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-dark mb-4">الإجراءات</h3>

              {project.status === "available" && !hasReservation && (
                <button
                  onClick={handleReserve}
                  disabled={reserving}
                  className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition disabled:opacity-50 mb-3"
                >
                  {reserving ? "جاري الحجز..." : "احجز هذا المشروع"}
                </button>
              )}

              {hasReservation && (
                <div className="w-full py-3 bg-secondary-light text-secondary text-center rounded-lg font-semibold mb-3">
                  لديك حجز نشط
                </div>
              )}

              {project.status === "reserved" && !hasReservation && (
                <div className="w-full py-3 bg-gray-100 text-gray-500 text-center rounded-lg font-semibold mb-3">
                  المشروع محجوز
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className={`w-full py-3 rounded-lg font-semibold transition border-2 ${
                  isSaved
                    ? "border-secondary text-secondary hover:bg-secondary-light"
                    : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
                }`}
              >
                {isSaved ? "✓ محفوظ" : "حفظ المشروع"}
              </button>
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-dark mb-4">معلومات</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">رقم المشروع</span>
                  <span className="font-semibold">#{project.number}</span>
                </div>
                {project.country && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">الدولة</span>
                    <span className="font-semibold">{project.country}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">المجال</span>
                  <span className="font-semibold">{project.categoryAr}</span>
                </div>
              </div>
            </motion.div>

            {!session && (
              <div className="bg-primary-light rounded-2xl p-6 text-center">
                <p className="text-primary font-semibold mb-3">سجّل دخولك لتتمكن من الحجز</p>
                <Link href="/auth/login" className="block py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition">
                  تسجيل الدخول
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
