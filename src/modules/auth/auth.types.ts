import { z } from "zod";

export const registerInputSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Adresse e-mail invalide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;
