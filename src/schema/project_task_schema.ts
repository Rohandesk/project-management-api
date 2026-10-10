import { z } from "zod";

export interface ProjectTask extends Document {
  project_name: string;
  user_id: number;
  task_name: string;
  status: string;
}

export const ProjectTaskSchema = z.object({
    project_name: z.string().min(1, "Project name is required").max(50, "Project name should not ge greater than 50 char"),
    user_id: z.number().int().min(1, "User id is required"),
    task_name: z.string().min(1, "Task name is required").max(50, "Task name should not ge greater than 50 char"),
    status: z.enum(["pending", "in_progress", "completed", "hold"])
})

export type createProjectWithTask = z.infer<typeof ProjectTaskSchema>