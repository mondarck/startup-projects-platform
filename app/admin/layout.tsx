'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const navItems = [
  { href: "/admin", label: "لوحة المراقبة", icon: "📊" },
  { href: "/admin/students", label: "إدارة الطلبة", icon: "👥" },
  { href: "/admin/projects", label: "إدارة المشاريع", icon: "📦" },
  { href: "/admin/reports", label: "التقارير", icon: "📈" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !["admin", "super_admin", "moderator"].includes(session.user.role)) {
      router.push("/auth/login");
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-light flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white flex flex-col min-h-screen fixed right-0 top-0">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-bold">لوحة التحكم</h2>
          <p className="text-gray-400 text-sm mt-1">{session.user.name}</p>
          <span className="text-xs bg-primary px-2 py-0.5 rounded-full mt-1 inline-block">
            {session.user.role === "super_admin" ? "مدير عام" : "مشرف"}
          </span>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    pathname === item.href
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white transition text-sm">
            🏠 العودة للموقع
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-red-400 transition text-sm w-full text-right"
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
