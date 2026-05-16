import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const country = searchParams.get("country") ?? "";
    const status = searchParams.get("status") ?? "available";
    const sort = searchParams.get("sort") ?? "relevance";

    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { nameAr: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
        { descriptionAr: { contains: search, mode: "insensitive" } },
        { categoryAr: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.categoryAr = { contains: category, mode: "insensitive" };
    }

    if (country) {
      where.country = { contains: country, mode: "insensitive" };
    }

    const orderBy: any = {};
    switch (sort) {
      case "newest":
        orderBy.createdAt = "desc";
        break;
      case "most_viewed":
        orderBy.viewsCount = "desc";
        break;
      case "rating":
        orderBy.rating = "desc";
        break;
      default:
        orderBy.number = "asc";
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          number: true,
          nameAr: true,
          nameEn: true,
          country: true,
          categoryAr: true,
          descriptionAr: true,
          status: true,
          isFeatured: true,
          viewsCount: true,
          savedCount: true,
          rating: true,
          imageUrl: true,
        },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { success: false, error: "فشل تحميل المشاريع" },
      { status: 500 }
    );
  }
}
