import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const templates = [
  {
    name: "Minimal",
    description: "Épuré, typographie soignée, beaucoup de blanc — pour une offre premium et sobre.",
    structure: { themeKey: "minimal" },
    isPremium: false,
  },
  {
    name: "Bold",
    description: "Hero sombre, contrastes forts, CTA percutants — pour une promesse directe et énergique.",
    structure: { themeKey: "bold" },
    isPremium: false,
  },
  {
    name: "Editorial",
    description: "Style magazine, chaleureux, met en avant les témoignages — pour une offre orientée confiance.",
    structure: { themeKey: "editorial" },
    isPremium: false,
  },
];

async function main() {
  for (const template of templates) {
    await prisma.template.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    });
  }
  console.log(`Seeded ${templates.length} templates.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
