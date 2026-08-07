import { z } from "zod";

export const userSchema = z.object({
    lastName: z.string().min(2),
    firstName: z.string().min(2),
    email: z.email(),
});

export type UserFormData = z.infer<typeof userSchema>;