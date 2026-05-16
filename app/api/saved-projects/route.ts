import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });

  const saved = await prisma.savedProject.findMany({
    where: { userId: session.user.id },
    include: {
      project: {
        select: {
          id: true,
          nameAr: true,
          categoryAr: true,
          country: true,
          descriptionAr: true,
          status: true,
          rating: true,
          viewsCount: true,
        },
      },
    },
    orderBy: { savedAt: "desc" },
  });

  return NextResponse.json({ success: true, data: saved });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });

  const { projectId } = await req.json();

  const existing = await prisma.savedProject.findUnique({
    where: { userId_projectId: { userId: session.user.id, projectId } },
  });

  if (existing) {
    await prisma.savedProject.delete({
      where: { userId_projectId: { userId: session.user.id, projectId } },
    });
    await prisma.project.update({ where: { id: projectId }, data: { savedCount: { decrement: 1 } } });
    return NextResponse.json({ success: true, saved: false, message: "تم إزالة المشروع من المحفوظات" });
  }

  await prisma.savedProject.create({ data: { userId: session.user.id, projectId } });
  await prisma.project.update({ where: { id: projectId }, data: { savedCount: { increment: 1 } } });
  return NextResponse.json({ success: true, saved: true, message: "تم حفظ المشروع" }, { status: 201 });
}
