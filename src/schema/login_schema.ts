import {z} from "zod";

export interface LoginUser extends Document {
    user_email: string;
    password: string
}

export const LoginUserSchema = z.object({
    user_email: z.string().trim().email('Invalid email format').min(1, "Email is required"),
    password: z.string().min(1, "Password is required")
})

export type LoginUserInput = z.infer<typeof LoginUserSchema>