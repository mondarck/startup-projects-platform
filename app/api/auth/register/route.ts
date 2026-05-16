import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  universityId: z.string().min(5),
  facultyId: z.number().int().positive(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { universityId: data.universityId },
        ],
      },
    });

    if (existingUser) {
      const field = existingUser.email === data.email ? "البريد الإلكتروني" : "رقم التسجيل";
      return NextResponse.json(
        { success: false, error: `${field} مسجل مسبقاً` },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        universityId: data.universityId,
        facultyId: data.facultyId,
        passwordHash,
        status: "pending",
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        actionType: "USER_REGISTERED",
        entityType: "user",
        description: `طالب جديد ${data.firstName} ${data.lastName} سجّل في المنصة`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء الحساب بنجاح. في انتظار تفعيل الحساب من قبل المشرف.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "بيانات غير صالحة", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}
