import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "super_admin", "moderator"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const [byFacultyRaw, byCategory, byCountry, recentReservations, faculties] = await Promise.all([
      prisma.user.groupBy({
        by: ["facultyId"],
        _count: { facultyId: true },
        where: { status: "active" },
      }),
      prisma.project.groupBy({
        by: ["categoryAr"],
        _count: { categoryAr: true },
        orderBy: { _count: { categoryAr: "desc" } },
        take: 10,
      }),
      prisma.project.groupBy({
        by: ["country"],
        _count: { country: true },
        orderBy: { _count: { country: "desc" } },
        take: 10,
        where: { country: { not: null } },
      }),
      prisma.reservation.findMany({
        take: 20,
        orderBy: { reservedAt: "desc" },
        where: { status: "active" },
        include: {
          user: { select: { firstName: true, lastName: true, faculty: { select: { nameAr: true } } } },
          project: { select: { nameAr: true, number: true, categoryAr: true } },
        },
      }),
      prisma.faculty.findMany({ select: { id: true, nameAr: true } }),
    ]);

    // Faculty.id is Int — build map with string keys for safe indexing
    const facultyMap: Record<string, string> = {};
    for (const f of faculties) {
      facultyMap[String(f.id)] = f.nameAr;
    }

    return NextResponse.json({
      success: true,
      data: {
        byFaculty: byFacultyRaw.map((f) => ({
          faculty: facultyMap[String(f.facultyId)] ?? "غير معروف",
          count: f._count.facultyId,
        })),
        byCategory: byCategory.map((c) => ({
          category: c.categoryAr,
          count: c._count.categoryAr,
        })),
        byCountry: byCountry.map((c) => ({
          country: c.country ?? "غير محدد",
          count: c._count.country,
        })),
        recentReservations,
      },
    });
  } catch (error) {
    console.error("Reports GET error:", error);
    return NextResponse.json({ success: false, error: "فشل تحميل التقارير" }, { status: 500 });
  }
}
