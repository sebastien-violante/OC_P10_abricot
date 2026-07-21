import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(2),
    contributors: z.array(z.string().email()).optional()
});

export type ProjectFormData = z.infer<typeof projectSchema>;