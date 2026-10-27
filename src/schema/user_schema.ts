import {z} from "zod";

export interface Users extends Document {
    user_name: string;
    user_email: string;
    password: string;
    user_phone: string;
}

// zod validation
export const UserSchema = z.object({
    user_name: z.string().trim().min(1, "User name is required").max(50, "User name must be less than 50 characters"),
    user_email: z.string().trim().min(1, "Email is required").email('Invalid email format').toLowerCase(),
    password: z.string().min(1, "Password is required").max(255, "Password should be greater than 255 characters"),
    user_phone: z.string().min(1, "User phone is required").max(10, "Number should be greater than 10 characters")
})

export type CreateUserInput = z.infer<typeof UserSchema>;