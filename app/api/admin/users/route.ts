import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "super_admin", "moderator"].includes(session.user.role)) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const facultyId = searchParams.get("facultyId") ?? "";

  const where: any = {};
  if (status) where.status = status;
  if (facultyId) where.facultyId = parseInt(facultyId);
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { universityId: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        faculty: { select: { nameAr: true } },
        reservation: {
          include: { project: { select: { nameAr: true, number: true } } },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      universityId: u.universityId,
      status: u.status,
      faculty: u.faculty.nameAr,
      reservation: u.reservation
        ? { projectName: u.reservation.project.nameAr, projectNumber: u.reservation.project.number, reservedAt: u.reservation.reservedAt }
        : null,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
    })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}
