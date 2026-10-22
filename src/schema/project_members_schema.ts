import {z} from "zod";

export interface ProjectMembers extends Document{
    user_id: number;
    project_id: number;
}

export const ProjectMembersSchema = z.object({
    user_id: z.number().int().min(1, "User id is required"),
    project_id: z.number().int().min(1, "Project id is required"),
})

export type createProjectMember = z.infer<typeof ProjectMembersSchema>