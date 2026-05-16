import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "super_admin", "moderator"].includes(session.user.role)) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  try {
    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      totalProjects,
      availableProjects,
      reservedProjects,
      totalReservations,
      recentActivity,
      categoryStats,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "active" } }),
      prisma.user.count({ where: { status: "pending" } }),
      prisma.project.count(),
      prisma.project.count({ where: { status: "available" } }),
      prisma.project.count({ where: { status: "reserved" } }),
      prisma.reservation.count({ where: { status: "active" } }),
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstName: true, lastName: true } },
          admin: { select: { fullName: true } },
        },
      }),
      prisma.project.groupBy({
        by: ["categoryAr"],
        _count: { categoryAr: true },
        orderBy: { _count: { categoryAr: "desc" } },
        take: 8,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        pendingUsers,
        totalProjects,
        availableProjects,
        reservedProjects,
        totalReservations,
        recentActivity,
        categoryStats: categoryStats.map((c) => ({
          category: c.categoryAr,
          count: c._count.categoryAr,
        })),
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ" }, { status: 500 });
  }
}
