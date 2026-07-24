import { z } from "zod";

export const taskSchema = z.object({
    title: z.string().min(2),
    description: z.string().min(2),
    assignees: z.array(z.string()).optional(),
    dueDate: z.string(),
    status: z.string()
});

export type TaskFormData = z.infer<typeof taskSchema>;