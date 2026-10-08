import {z} from "zod";

export interface Projects extends Document {
    project_name: string;
    user_id: number;
}

export const ProjectsSchema = z.object({
    project_name: z.string().min(1, 'Project name is required').max(100, "project name should not greater than 00 chars"),
    user_id: z.number().min(1, "User id is required")
})

export type CreateProjectInput = z.infer<typeof ProjectsSchema>;