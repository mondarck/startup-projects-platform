import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Parse semicolon-separated CSV (handles BOM and quoted fields)
function parseCSV(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8").replace(/^﻿/, "");
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  const headers = lines[0].split(";").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(";").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
    return row;
  });
}

async function main() {
  console.log("🌱 Starting seed...\n");

  // ─── Faculties ───────────────────────────────────────────────────────────
  const facultyData = [
    { nameAr: "كلية التكنولوجيا",                    nameEn: "Faculty of Technology",              code: "FT"  },
    { nameAr: "كلية العلوم الدقيقة",                 nameEn: "Faculty of Exact Sciences",           code: "FES" },
    { nameAr: "كلية علوم الطبيعة والحياة",           nameEn: "Faculty of Natural Sciences",         code: "FNS" },
    { nameAr: "كلية الآداب واللغات",                 nameEn: "Faculty of Arts and Languages",       code: "FAL" },
    { nameAr: "كلية العلوم الاجتماعية والإنسانية",  nameEn: "Faculty of Social Sciences",          code: "FSS" },
    { nameAr: "كلية الحقوق والعلوم السياسية",        nameEn: "Faculty of Law and Political Science", code: "FLP" },
    { nameAr: "كلية العلوم الاقتصادية والتجارية",   nameEn: "Faculty of Economics and Business",   code: "FEB" },
    { nameAr: "معهد العلوم الإسلامية",               nameEn: "Institute of Islamic Sciences",       code: "IIS" },
  ];

  for (const f of facultyData) {
    await prisma.faculty.upsert({
      where: { code: f.code },
      update: {},
      create: f,
    });
  }
  console.log(`✅ ${facultyData.length} faculties ready`);

  // ─── Super Admin ─────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@1234", 12);
  await prisma.admin.upsert({
    where: { email: "admin@university.edu" },
    update: {},
    create: {
      email:        "admin@university.edu",
      passwordHash: adminPassword,
      fullName:     "مدير النظام",
      role:         "super_admin",
      isActive:     true,
    },
  });
  console.log("✅ Super admin ready");

  // ─── Projects from CSV ───────────────────────────────────────────────────
  const csvPath = path.join(__dirname, "data", "projects.csv");

  if (!fs.existsSync(csvPath)) {
    console.log("⚠️  projects.csv not found — skipping project import");
    return;
  }

  const rows = parseCSV(csvPath);
  console.log(`📂 Found ${rows.length} rows in CSV…`);

  let imported = 0;
  let skipped  = 0;

  // Process in batches of 200 for speed
  const BATCH = 200;

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);

    await Promise.all(
      batch.map(async (row) => {
        const number      = parseInt(row["الرقم"] ?? "");
        const nameAr      = (row["الشركة الناشئة"] ?? "").trim();
        const country     = (row["الدولة"] ?? "").trim() || null;
        const categoryAr  = (row["المجال"] ?? "").trim() || "عام";
        const descriptionAr = (row["وصف النشاط"] ?? "").trim() || nameAr;

        if (!nameAr || isNaN(number)) { skipped++; return; }

        try {
          await prisma.project.upsert({
            where: { number },
            update: { nameAr, country, categoryAr, descriptionAr },
            create: { number, nameAr, country, categoryAr, descriptionAr },
          });
          imported++;
        } catch {
          skipped++;
        }
      })
    );

    process.stdout.write(`\r   Progress: ${Math.min(i + BATCH, rows.length)} / ${rows.length}`);
  }

  console.log(`\n✅ Projects imported: ${imported}  |  Skipped: ${skipped}`);

  // ─── Done ─────────────────────────────────────────────────────────────────
  console.log("\n🎉 Seed complete!\n");
  console.log("┌──────────────────────────────────────┐");
  console.log("│  Admin → admin@university.edu        │");
  console.log("│  Pass  → Admin@1234                  │");
  console.log("└──────────────────────────────────────┘\n");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
