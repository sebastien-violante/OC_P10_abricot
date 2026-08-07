import { z } from "zod";

export const authSchema = z.object({
    email: z.email("L'email saisi n'a pas un format valide"),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(128, "Le mot de passe est trop long") 
});

export type AuthFormData = z.infer<typeof authSchema>;