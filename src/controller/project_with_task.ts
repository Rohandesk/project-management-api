import { PrismaClient, Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "../config/dotenv";
import { ProjectTaskSchema } from "../schema/project_task_schema";
import throwError from "../utils/throwError";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const ProjectWithTaskController = {
  createProjectWithTask: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validation = ProjectTaskSchema.safeParse(req.body);
      switch (validation.success) {
        case false:
          // res.status(400).json({message: validation.error.issues[0].message});
          throwError(400, validation.error.issues[0].message, next);
          break;
        default:
          const createProjectAlongWithTask = await prisma.$transaction(
            async (tx) => {
              const project = await tx.projects.create({
                data: {
                  project_name: validation.data.project_name,
                  user_id: validation.data.user_id,
                },
              });
              const task = await tx.tasks.create({
                data: {
                  task_name: validation.data.task_name,
                  status: validation.data.status,
                  project_id: project.project_id,
                  // project_id: 99
                },
              });
              return {
                project,
                task,
              };
            },
          );
          res
            .status(201)
            .json({
              message: "successfully created",
              data: createProjectAlongWithTask,
            });
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        // res.status(409).json({message: "User with this email already exists"});
        throwError(409, "Something went wrong", next);
      } else {
        throwError(500, "Internal Server Error", next);
      }
    }
  },
};
