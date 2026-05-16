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

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { nameAr: { contains: search, mode: "insensitive" } },
      { nameEn: { contains: search, mode: "insensitive" } },
      { categoryAr: { contains: search, mode: "insensitive" } },
      { country: { contains: search, mode: "insensitive" } },
    ];
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { number: "asc" },
    }),
    prisma.project.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: projects,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "super_admin"].includes(session.user.role)) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  const data = await req.json();
  const maxNumber = await prisma.project.findFirst({ orderBy: { number: "desc" }, select: { number: true } });
  const newNumber = (maxNumber?.number ?? 0) + 1;

  const project = await prisma.project.create({
    data: {
      number: newNumber,
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      country: data.country,
      categoryAr: data.categoryAr,
      categoryEn: data.categoryEn,
      descriptionAr: data.descriptionAr,
      descriptionEn: data.descriptionEn,
    },
  });

  return NextResponse.json({ success: true, data: project }, { status: 201 });
}
