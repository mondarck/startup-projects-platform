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

  const data = await req.json();
  const id = parseInt(params.id);

  const project = await prisma.project.update({
    where: { id },
    data: {
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      country: data.country,
      categoryAr: data.categoryAr,
      descriptionAr: data.descriptionAr,
      status: data.status,
      isFeatured: data.isFeatured,
    },
  });

  return NextResponse.json({ success: true, data: project });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  const id = parseInt(params.id);
  await prisma.project.update({ where: { id }, data: { status: "archived" } });

  return NextResponse.json({ success: true, message: "تم أرشفة المشروع" });
}
