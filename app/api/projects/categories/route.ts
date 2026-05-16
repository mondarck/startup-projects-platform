import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [categoryRows, countryRows] = await Promise.all([
      prisma.project.findMany({
        select: { categoryAr: true },
        distinct: ["categoryAr"],
        orderBy: { categoryAr: "asc" },
      }),
      prisma.project.findMany({
        where: { country: { not: null } },
        select: { country: true },
        distinct: ["country"],
        orderBy: { country: "asc" },
      }),
    ]);

    const categories = categoryRows.map((r) => r.categoryAr).filter(Boolean);
    const countries = countryRows.map((r) => r.country).filter(Boolean) as string[];

    return NextResponse.json({ success: true, data: { categories, countries } });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ success: false, error: "فشل تحميل التصنيفات" }, { status: 500 });
  }
}
