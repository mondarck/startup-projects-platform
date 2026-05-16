'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

const faculties = [
  { id: 1, nameAr: "كلية التكنولوجيا" },
  { id: 2, nameAr: "كلية العلوم الدقيقة" },
  { id: 3, nameAr: "كلية علوم الطبيعة والحياة" },
  { id: 4, nameAr: "كلية الآداب واللغات" },
  { id: 5, nameAr: "كلية العلوم الاجتماعية والإنسانية" },
  { id: 6, nameAr: "كلية الحقوق والعلوم السياسية" },
  { id: 7, nameAr: "كلية العلوم الاقتصادية والتجارية" },
  { id: 8, nameAr: "معهد العلوم الإسلامية" },
];

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    universityId: "",
    facultyId: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("كلمتا المرور غير متطابقتان");
      return;
    }
    if (formData.password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        universityId: formData.universityId,
        facultyId: parseInt(formData.facultyId),
        password: formData.password,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setSuccess(true);
    } else {
      setError(data.error ?? "حدث خطأ. حاول مرة أخرى.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-light to-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-dark mb-3">تم التسجيل بنجاح!</h2>
          <p className="text-gray-500 mb-6">
            تم إنشاء حسابك. في انتظار تفعيل الحساب من قبل المشرف. ستتلقى إشعاراً عند التفعيل.
          </p>
          <Link href="/auth/login" className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition">
            الذهاب لتسجيل الدخول
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📝</div>
            <h1 className="text-2xl font-bold text-dark">تسجيل جديد</h1>
            <p className="text-gray-500 text-sm mt-1">انضم إلى منصة المشاريع الناشئة</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">الاسم الأول *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="أحمد"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">اللقب *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="محمد"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">البريد الإلكتروني *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@univ-eloued.dz"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">رقم الهاتف *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+213xxxxxxxx"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">رقم التسجيل الجامعي *</label>
                <input
                  type="text"
                  name="universityId"
                  value={formData.universityId}
                  onChange={handleChange}
                  placeholder="2025001234"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">الكلية *</label>
              <select
                name="facultyId"
                value={formData.facultyId}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition bg-white"
                required
              >
                <option value="">اختر الكلية</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>{f.nameAr}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">كلمة المرور *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="8 أحرف على الأقل"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">تأكيد كلمة المرور *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition disabled:opacity-50 text-lg mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  جاري التسجيل...
                </span>
              ) : "إنشاء الحساب"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              لديك حساب بالفعل؟{" "}
              <Link href="/auth/login" className="text-primary font-semibold hover:text-primary-dark">
                دخول
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
