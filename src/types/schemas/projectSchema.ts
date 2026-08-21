import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(2, "Le titre du projet doit comprende au moins 2 caractères"),
    description: z.string().min(2, "La  description du projet doit comprende au moins 2 caractères"),
    contributors: z.array(z.string().email()).optional()
});

export type ProjectFormData = z.infer<typeof projectSchema>;