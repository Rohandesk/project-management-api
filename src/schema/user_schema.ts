import {z} from "zod";

export interface Users extends Document {
    user_name: string;
    user_email: string;
}

// zod validation
export const UserSchema = z.object({
    user_name: z.string().trim().min(1, "User name is required").max(50, "User name must be less than 50 characters"),
    user_email: z.string().trim().min(1, "Email is required").email('Invalid email format').toLowerCase(),
})

export type CreateUserInput = z.infer<typeof UserSchema>;