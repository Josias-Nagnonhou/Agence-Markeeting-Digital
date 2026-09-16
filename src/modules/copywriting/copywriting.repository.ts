import { prisma } from "@/lib/db/prisma";
import type { SectionType } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";

export function listSections(pageId: string) {
  return prisma.pageSection.findMany({ where: { pageId }, orderBy: { position: "asc" } });
}

export async function replaceSections(
  pageId: string,
  sections: { type: SectionType; content: Prisma.InputJsonValue }[],
) {
  await prisma.$transaction([
    prisma.pageSection.deleteMany({ where: { pageId } }),
    ...sections.map((section, position) =>
      prisma.pageSection.create({
        data: { pageId, type: section.type, content: section.content, position },
      }),
    ),
  ]);

  return listSections(pageId);
}

export function findSection(pageId: string, sectionId: string) {
  return prisma.pageSection.findFirst({ where: { id: sectionId, pageId } });
}

export function updateSectionContent(sectionId: string, content: Prisma.InputJsonValue) {
  return prisma.pageSection.update({ where: { id: sectionId }, data: { content } });
}
