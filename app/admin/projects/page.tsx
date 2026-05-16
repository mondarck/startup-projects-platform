'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Papa from "papaparse";

interface Project {
  id: number;
  number: number;
  nameAr: string;
  nameEn?: string;
  country?: string;
  categoryAr: string;
  status: string;
  viewsCount: number;
  savedCount: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  reserved: "bg-blue-100 text-blue-700",
  archived: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  available: "متاح",
  reserved: "محجوز",
  archived: "مؤرشف",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    const res = await fetch(`/api/admin/projects?${params}`);
    const data = await res.json();
    if (data.success) {
      setProjects(data.data);
      setPagination(data.pagination);
    }
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleImportCSV(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as Record<string, string>[];
        const projects = rows.map((row, i) => ({
          number: parseInt(row["الرقم"] ?? row["number"] ?? row["id"] ?? String(i + 1)),
          nameAr: row["اسم الشركة"] ?? row["name"] ?? row["nameAr"] ?? "",
          country: row["الدولة"] ?? row["country"] ?? "",
          categoryAr: row["المجال"] ?? row["category"] ?? row["categoryAr"] ?? "عام",
          descriptionAr: row["وصف النشاط"] ?? row["description"] ?? row["descriptionAr"] ?? "",
        })).filter((p) => p.nameAr && !isNaN(p.number));

        const res = await fetch("/api/admin/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects }),
        });

        const data = await res.json();
        if (data.success) {
          setImportResult(data.data);
          load();
        }
        setImporting(false);
      },
      error: () => setImporting(false),
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-dark">إدارة المشاريع</h1>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 font-semibold"
          >
            {importing ? "جاري الاستيراد..." : "استيراد CSV"}
          </button>
        </div>
      </div>

      {importResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary-light border border-secondary text-secondary rounded-xl p-4 mb-6"
        >
          تم استيراد {importResult.imported} مشروع بنجاح • تم تخطي {importResult.skipped}
        </motion.div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="ابحث بالاسم أو المجال..."
          className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
        >
          <option value="">جميع الحالات</option>
          <option value="available">متاح</option>
          <option value="reserved">محجوز</option>
          <option value="archived">مؤرشف</option>
        </select>
        <div className="text-sm text-gray-500 self-center">
          {pagination?.total ?? 0} مشروع
        </div>
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
                  <th className="px-4 py-3 text-right">#</th>
                  <th className="px-4 py-3 text-right">اسم المشروع</th>
                  <th className="px-4 py-3 text-right">المجال</th>
                  <th className="px-4 py-3 text-right">الدولة</th>
                  <th className="px-4 py-3 text-right">الحالة</th>
                  <th className="px-4 py-3 text-right">المشاهدات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-light transition">
                    <td className="px-4 py-3 text-gray-400 text-sm">{project.number}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-dark">{project.nameAr}</div>
                      {project.nameEn && <div className="text-xs text-gray-400">{project.nameEn}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{project.categoryAr}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{project.country ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[project.status] ?? "bg-gray-100"}`}>
                        {statusLabels[project.status] ?? project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{project.viewsCount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {projects.length === 0 && (
              <div className="text-center py-12 text-gray-400">لا توجد مشاريع</div>
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
