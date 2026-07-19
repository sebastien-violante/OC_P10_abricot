import { z } from "zod";

export const projectSchema = z.object({
    title: z.string().min(2),
    description: z.string().min(3),
    collaborators: z.array(z.string().email()).optional()
});

export type ProjectFormData = z.infer<typeof projectSchema>;