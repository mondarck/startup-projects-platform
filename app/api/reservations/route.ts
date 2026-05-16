import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "student") {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  try {
    const reservation = await prisma.reservation.findUnique({
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
            number: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: reservation });
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "student") {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { projectId, studentNotes } = await req.json();

    // Check existing reservation
    const existing = await prisma.reservation.findUnique({
      where: { userId: session.user.id },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "لقد قمت بحجز مشروع بالفعل. يجب إلغاء الحجز السابق أولاً." },
        { status: 409 }
      );
    }

    // Check project availability
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.status !== "available") {
      return NextResponse.json(
        { success: false, error: "المشروع غير متاح للحجز" },
        { status: 400 }
      );
    }

    const [reservation] = await prisma.$transaction([
      prisma.reservation.create({
        data: {
          userId: session.user.id,
          projectId,
          studentNotes,
          status: "active",
        },
      }),
      prisma.project.update({
        where: { id: projectId },
        data: { status: "reserved" },
      }),
    ]);

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        actionType: "PROJECT_RESERVED",
        entityType: "project",
        entityId: projectId,
        description: `حجز المشروع: ${project.nameAr}`,
      },
    });

    return NextResponse.json({ success: true, data: reservation, message: "تم حجز المشروع بنجاح" }, { status: 201 });
  } catch (error) {
    console.error("Reservation POST error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "student") {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { reason } = await req.json().catch(() => ({}));

    const reservation = await prisma.reservation.findUnique({
      where: { userId: session.user.id },
    });
    if (!reservation) {
      return NextResponse.json({ success: false, error: "لا يوجد حجز نشط" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.reservation.update({
        where: { userId: session.user.id },
        data: {
          status: "cancelled",
          reasonForCancel: reason,
          cancelledAt: new Date(),
        },
      }),
      prisma.project.update({
        where: { id: reservation.projectId },
        data: { status: "available" },
      }),
    ]);

    return NextResponse.json({ success: true, message: "تم إلغاء الحجز بنجاح" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ" }, { status: 500 });
  }
}
