'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isAdmin = session && ["admin", "super_admin", "moderator"].includes(session.user.role);
  const isStudent = session && session.user.role === "student";

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logoue.webp" alt="جامعة الوادي" width={44} height={44} className="h-11 w-auto object-contain" priority />
            <Image src="/IncubatorEloued.webp" alt="حاضنة الأعمال الوادي" width={44} height={44} className="h-11 w-auto object-contain" priority />
            <span className="hidden lg:inline font-bold text-primary text-base leading-tight">
              منصة المشاريع<br />
              <span className="text-xs font-normal text-gray-500">جامعة الوادي</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/projects" className="text-dark hover:text-primary transition font-medium">
              المشاريع
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-dark hover:text-primary transition font-medium">
                لوحة التحكم
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex gap-3 items-center">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-primary transition"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {session.user.name?.charAt(0) ?? "U"}
                  </div>
                  <span className="text-dark text-sm font-medium">{session.user.name?.split(" ")[0]}</span>
                  <span className="text-gray-400 text-xs">▼</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-dark text-sm">{session.user.name}</p>
                        <p className="text-xs text-gray-400">{session.user.email}</p>
                      </div>
                      {isStudent && (
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-light transition text-sm">
                          📊 لوحتي الشخصية
                        </Link>
                      )}
                      {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-light transition text-sm">
                          ⚙️ لوحة التحكم
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 transition text-sm text-right"
                      >
                        🚪 تسجيل الخروج
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-primary border-2 border-primary hover:bg-primary-light rounded-lg transition font-medium"
                >
                  دخول
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
                >
                  تسجيل جديد
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-dark transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-dark transition-all ${isOpen ? "opacity-0" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-dark transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="py-4 space-y-1">
                <Link href="/projects" className="block px-4 py-2 text-dark hover:bg-light rounded-lg" onClick={() => setIsOpen(false)}>
                  المشاريع
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="block px-4 py-2 text-dark hover:bg-light rounded-lg" onClick={() => setIsOpen(false)}>
                    لوحة التحكم
                  </Link>
                )}
                {isStudent && (
                  <Link href="/dashboard" className="block px-4 py-2 text-dark hover:bg-light rounded-lg" onClick={() => setIsOpen(false)}>
                    لوحتي الشخصية
                  </Link>
                )}
                <div className="flex gap-2 px-4 pt-2">
                  {session ? (
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex-1 text-center py-2 border-2 border-red-300 text-red-500 rounded-lg"
                    >
                      تسجيل الخروج
                    </button>
                  ) : (
                    <>
                      <Link href="/auth/login" className="flex-1 text-center py-2 text-primary border-2 border-primary rounded-lg">
                        دخول
                      </Link>
                      <Link href="/auth/signup" className="flex-1 text-center py-2 bg-primary text-white rounded-lg">
                        تسجيل
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
