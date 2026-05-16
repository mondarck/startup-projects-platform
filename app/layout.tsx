import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "منصة استكشاف المشاريع الناشئة | جامعة الوادي",
  description: "اكتشف أفكار المشاريع المبتكرة واختر مشروعك الخاص - حاضنة الأعمال بالوادي",
  keywords: ["مشاريع", "ناشئة", "ابتكار", "جامعة", "تعليم", "جامعة الوادي"],
  openGraph: {
    title: "منصة استكشاف المشاريع الناشئة",
    description: "اكتشف وحجز المشاريع الناشئة المبتكرة",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-white text-dark">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
