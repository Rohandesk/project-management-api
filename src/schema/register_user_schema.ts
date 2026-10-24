import {z} from "zod";

export interface RegisterUser extends Document {
    user_name: string;
    user_email: string;
    user_phone: string;
    password: string;
}

export const registerUserSchema = z.object({
    user_name: z.string().trim().min(1, "User name is required").max(50, "User name should be less than 50 characters"),
    user_email: z.string().trim().min(1, "Email is required").email("Invalid email format").toLowerCase(),
    user_phone: z.string().min(1, "Phone number is required"),
    password: z.string().min(1, "Password is required").max(255, "Password should be greater than 255 characters")
})

export type CreateRegisterUser = z.infer<typeof registerUserSchema>