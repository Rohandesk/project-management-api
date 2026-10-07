import {zod} from zod;

export interface Users extends Document {
    user_name: string;
    user_email: string;
}

// zod validation
export const userSchema = zod.object({
    user_name: zod.string().trim().min(1, "User name is required").max(50, "User name must be less than 50 characters"),
    user_email: zod.string().trim().email('Invalid email format').toLowerCase(),
})