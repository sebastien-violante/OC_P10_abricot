import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string()
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}$/, {message: "Le prénom doit contenir au moins 2 caractères."}),
    lastName: z.string()
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}$/, {message: "Le nom doit contenir au moins 2 caractères."}),
    email: z.email("Le format de l'email est invalide"),
    password : z.string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins 1 majuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins 1 chiffre")
      .regex(/[^A-Za-z0-9]/,"Le mot de passe doit contenir au moins 1 caractère spécial"),
});

export type registerFormData = z.infer<typeof registerSchema>;