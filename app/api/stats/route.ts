import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalProjects, availableProjects, totalStudents, activeReservations] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: "available" } }),
      prisma.user.count({ where: { status: "active" } }),
      prisma.reservation.count({ where: { status: "active" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: { totalProjects, availableProjects, totalStudents, activeReservations },
    });
  } catch (error) {
    console.error("Stats GET error:", error);
    return NextResponse.json({ success: false, error: "فشل تحميل الإحصائيات" }, { status: 500 });
  }
}
