import { z } from "zod";

export const projectSchema = z.object({
    title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
    description: z.string().min(3, "La description doit contenir au moins 3 caractères"),
    assignees: z.array(z.string())
});

export type ProjectFormData = z.infer<typeof projectSchema>;