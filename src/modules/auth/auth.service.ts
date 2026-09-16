import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { registerInputSchema, type RegisterInput } from "@/modules/auth/auth.types";

export class EmailAlreadyUsedError extends Error {
  constructor() {
    super("Un compte existe déjà avec cet e-mail.");
  }
}

export async function registerUser(input: RegisterInput) {
  const data = registerInputSchema.parse(input);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new EmailAlreadyUsedError();

  const passwordHash = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      creditBalance: 5,
      creditEntries: {
        create: {
          type: "GRANT",
          reason: "SIGNUP_BONUS",
          amount: 5,
        },
      },
    },
  });
}
