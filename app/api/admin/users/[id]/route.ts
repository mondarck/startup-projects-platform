import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "super_admin"].includes(session.user.role)) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  const { action } = await req.json();
  const userId = params.id;

  // Cancel student reservation — delete the record so the student can reserve again
  if (action === "cancel_reservation") {
    const reservation = await prisma.reservation.findUnique({ where: { userId } });
    if (!reservation) {
      return NextResponse.json({ success: false, error: "لا يوجد حجز نشط لهذا الطالب" }, { status: 404 });
    }
    await prisma.$transaction([
      prisma.reservation.delete({ where: { userId } }),
      prisma.project.update({
        where: { id: reservation.projectId },
        data: { status: "available" },
      }),
    ]);
    return NextResponse.json({ success: true, message: "تم إلغاء الحجز بنجاح" });
  }

  const statusMap: Record<string, string> = {
    activate: "active",
    suspend: "suspended",
    reject: "suspended",
  };

  const newStatus = statusMap[action];
  if (!newStatus) {
    return NextResponse.json({ success: false, error: "إجراء غير صالح" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
  });

  await prisma.activityLog.create({
    data: {
      adminId: session.user.id,
      actionType: `USER_${action.toUpperCase()}`,
      entityType: "user",
      description: `تم ${action === "activate" ? "تفعيل" : "تعليق"} حساب ${user.firstName} ${user.lastName}`,
    },
  });

  return NextResponse.json({ success: true, message: "تم تحديث الحساب بنجاح" });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: params.id },
    data: { status: "suspended" },
  });

  return NextResponse.json({ success: true, message: "تم حذف الحساب" });
}
