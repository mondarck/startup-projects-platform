'use client';

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logoue.webp" alt="جامعة الوادي" width={40} height={40} className="h-10 w-auto object-contain brightness-0 invert" />
              <Image src="/IncubatorEloued.webp" alt="حاضنة الأعمال" width={40} height={40} className="h-10 w-auto object-contain brightness-0 invert" />
            </div>
            <h4 className="font-bold text-lg mb-2">عن المنصة</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              منصة متخصصة لاستكشاف المشاريع الناشئة والمبتكرة لطلبة جامعة الوادي
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-300 hover:text-white transition">
                  المشاريع
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition">
                  عن المنصة
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <a href="mailto:support@university.edu" className="text-gray-300 hover:text-white transition">
                  البريد الإلكتروني
                </a>
              </li>
              <li>
                <a href="tel:+216123456789" className="text-gray-300 hover:text-white transition">
                  الهاتف
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-lg mb-4">تابعنا</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-primary transition">
                📘 Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition">
                𝕏 Twitter
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition">
                📷 Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-300 text-sm">
            © 2026 منصة استكشاف المشاريع الناشئة • جامعة الوادي • جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
