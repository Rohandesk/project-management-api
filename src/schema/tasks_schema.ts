import {z} from "zod";

export interface Tasks extends Document{
    task_name: string;
    status: string;
    project_id: number;
}

export const TasksSchema = z.object({
    task_name: z.string().min(1, "Task name is required").max(50, "task name should not greater than 50 chars"),
    status: z.enum(["pending", "in_progress", "completed", "hold"]),
    project_id: z.number().min(1, "Project id required")
})

export type createTasksInput = z.infer<typeof TasksSchema>