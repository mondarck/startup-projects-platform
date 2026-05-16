import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "معرف غير صالح" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "المشروع غير موجود" }, { status: 404 });
    }

    // Increment view count
    await prisma.project.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("Project GET error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ" }, { status: 500 });
  }
}
