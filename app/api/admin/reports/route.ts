import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "super_admin", "moderator"].includes(session.user.role)) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  const [byFaculty, byCategory, byCountry, recentReservations] = await Promise.all([
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
      include: {
        user: { select: { firstName: true, lastName: true, faculty: { select: { nameAr: true } } } },
        project: { select: { nameAr: true, number: true, categoryAr: true } },
      },
    }),
  ]);

  const faculties = await prisma.faculty.findMany({ select: { id: true, nameAr: true } });
  const facultyMap = Object.fromEntries(faculties.map((f) => [f.id, f.nameAr]));

  return NextResponse.json({
    success: true,
    data: {
      byFaculty: byFaculty.map((f) => ({
        faculty: facultyMap[f.facultyId] ?? "غير معروف",
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
}
