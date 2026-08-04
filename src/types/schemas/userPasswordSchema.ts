import { z } from "zod";

export const userPasswordSchema = z.object({
    currentPassword: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins 1 majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins 1 chiffre")
    .regex(
      /[^A-Za-z0-9]/,
      "Le mot de passe doit contenir au moins 1 caractère spécial"
    ),
    newPassword: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins 1 majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins 1 chiffre")
    .regex(
      /[^A-Za-z0-9]/,
      "Le mot de passe doit contenir au moins 1 caractère spécial"
    ),
});

export type userPasswordFormData = z.infer<typeof userPasswordSchema>;