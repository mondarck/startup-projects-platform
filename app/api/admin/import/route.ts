import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "super_admin"].includes(session.user.role)) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { projects } = await req.json() as {
      projects: Array<{
        number: number;
        nameAr: string;
        nameEn?: string;
        country?: string;
        categoryAr: string;
        descriptionAr: string;
      }>;
    };

    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ success: false, error: "لا توجد بيانات" }, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;

    // Process in batches of 100
    const batchSize = 100;
    for (let i = 0; i < projects.length; i += batchSize) {
      const batch = projects.slice(i, i + batchSize);
      for (const project of batch) {
        try {
          await prisma.project.upsert({
            where: { number: project.number },
            update: {
              nameAr: project.nameAr,
              nameEn: project.nameEn,
              country: project.country,
              categoryAr: project.categoryAr,
              descriptionAr: project.descriptionAr,
            },
            create: {
              number: project.number,
              nameAr: project.nameAr,
              nameEn: project.nameEn,
              country: project.country,
              categoryAr: project.categoryAr,
              descriptionAr: project.descriptionAr,
            },
          });
          imported++;
        } catch {
          skipped++;
        }
      }
    }

    await prisma.activityLog.create({
      data: {
        adminId: session.user.id,
        actionType: "PROJECTS_IMPORTED",
        description: `تم استيراد ${imported} مشروع (تخطي ${skipped})`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `تم استيراد ${imported} مشروع بنجاح`,
      data: { imported, skipped },
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ success: false, error: "فشل الاستيراد" }, { status: 500 });
  }
}
