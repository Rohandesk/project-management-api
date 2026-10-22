import {z} from "zod";

export interface UserProfile extends Document{
    user_id: number;
    bio: string;
}

export const UserProfileSchema = z.object({
    user_id: z.number().int().min(1, "User id is required"),
    bio: z.string().max(20, "Bio cannot exceed 20 characters").optional()
});

export type createUserProfileInput = z.infer<typeof UserProfileSchema>