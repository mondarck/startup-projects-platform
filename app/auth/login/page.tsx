'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (["admin", "super_admin", "moderator"].includes(session.user.role)) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn(isAdmin ? "admin-login" : "student-login", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(isAdmin ? "البريد الإلكتروني أو كلمة المرور غير صحيحة، أو الحساب غير نشط" : "البريد الإلكتروني أو كلمة المرور غير صحيحة. تأكد من تفعيل حسابك من قبل المشرف.");
    } else {
      router.push(isAdmin ? "/admin" : "/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🚀</div>
            <h1 className="text-2xl font-bold text-dark">
              {isAdmin ? "دخول المشرفين" : "تسجيل الدخول"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {isAdmin ? "لوحة تحكم المنصة" : "أهلاً بك في منصة المشاريع الناشئة"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex rounded-xl bg-light p-1 mb-6">
            <button
              onClick={() => { setIsAdmin(false); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${!isAdmin ? "bg-white shadow text-primary" : "text-gray-500 hover:text-dark"}`}
            >
              طالب
            </button>
            <button
              onClick={() => { setIsAdmin(true); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${isAdmin ? "bg-white shadow text-primary" : "text-gray-500 hover:text-dark"}`}
            >
              مشرف
            </button>
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
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@university.edu"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition disabled:opacity-50 text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  جاري الدخول...
                </span>
              ) : "دخول"}
            </button>
          </form>

          {!isAdmin && (
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">
                ليس لديك حساب؟{" "}
                <Link href="/auth/signup" className="text-primary font-semibold hover:text-primary-dark">
                  سجّل الآن
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
