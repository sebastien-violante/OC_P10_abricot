import { z } from "zod";

export const userSchema = z.object({
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    email: z.email("L'email saisi n'a pas un format valide"),
});

export type UserFormData = z.infer<typeof userSchema>;