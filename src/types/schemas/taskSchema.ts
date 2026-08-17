import { z } from "zod";

export const taskSchema = z.object({
    title: z.string().min(2, "Le titre de la tâche doit comprendre au moins 2 caractères"),
    description: z.string().min(2, "La description de la tâche doit comprendre au moins 2 caractères"),
    assignees: z.array(z.string()).optional(),
    dueDate: z.string().min(1, "La date d'échéance est obligatoire"),
    status: z.string()
});

export type TaskFormData = z.infer<typeof taskSchema>;