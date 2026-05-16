'use client';

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { formatDate, getStatusLabel } from "@/lib/utils";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  universityId: string;
  status: string;
  faculty: string;
  reservation: { projectName: string; projectNumber: number; reservedAt: string } | null;
  createdAt: string;
  lastLogin: string | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  suspended: "bg-red-100 text-red-700",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    if (data.success) {
      setStudents(data.data);
      setPagination(data.pagination);
    }
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleAction(userId: string, action: string) {
    setActionLoading(userId + action);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) await load();
    setActionLoading(null);
  }

  const statusLabel = getStatusLabel;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark">إدارة الطلبة</h1>
        <div className="text-sm text-gray-500">
          الإجمالي: {pagination?.total ?? 0} طالب
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="ابحث بالاسم أو البريد أو رقم التسجيل..."
          className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
        >
          <option value="">جميع الحالات</option>
          <option value="pending">في الانتظار</option>
          <option value="active">نشط</option>
          <option value="suspended">معلق</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light text-sm text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-right">الطالب</th>
                  <th className="px-4 py-3 text-right">البريد الإلكتروني</th>
                  <th className="px-4 py-3 text-right">الكلية</th>
                  <th className="px-4 py-3 text-right">الحالة</th>
                  <th className="px-4 py-3 text-right">المشروع</th>
                  <th className="px-4 py-3 text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => {
                  const sl = statusLabel(student.status);
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-light transition"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-dark">{student.firstName} {student.lastName}</div>
                        <div className="text-xs text-gray-400">{student.universityId}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{student.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{student.faculty}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[student.status] ?? "bg-gray-100"}`}>
                          {sl.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {student.reservation ? (
                          <span className="text-secondary font-semibold">#{student.reservation.projectNumber} {student.reservation.projectName}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {student.status === "pending" && (
                            <button
                              onClick={() => handleAction(student.id, "activate")}
                              disabled={actionLoading === student.id + "activate"}
                              className="px-3 py-1 bg-secondary text-white text-xs rounded-lg hover:bg-secondary-dark transition disabled:opacity-50"
                            >
                              تفعيل
                            </button>
                          )}
                          {student.status === "active" && (
                            <button
                              onClick={() => handleAction(student.id, "suspend")}
                              disabled={actionLoading === student.id + "suspend"}
                              className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                            >
                              تعليق
                            </button>
                          )}
                          {student.status === "suspended" && (
                            <button
                              onClick={() => handleAction(student.id, "activate")}
                              disabled={actionLoading === student.id + "activate"}
                              className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-lg hover:bg-green-200 transition disabled:opacity-50"
                            >
                              إعادة تفعيل
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {students.length === 0 && (
              <div className="text-center py-12 text-gray-400">لا توجد نتائج</div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-light"
          >
            السابق
          </button>
          <span className="px-4 py-2 bg-primary text-white rounded-lg">
            {page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-light"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
