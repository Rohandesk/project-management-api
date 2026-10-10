import { PrismaClient, Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "../config/dotenv";
import { TasksSchema } from "../schema/tasks_schema";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const TasksController = {
  createTasks: async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = TasksSchema.safeParse(req.body);
      switch (validation.success) {
        case false:
          if (validation.error.issues[0].path == "status") {
            res
              .status(400)
              .json({
                message:
                  "Status must be pending, in_progress, hold or completed",
              });
          } else {
            res
              .status(400)
              .json({ message: validation.error.issues[0].message });
          }
          break;
        default:
          const createTaskQuery = await prisma.tasks.create({
            data: {
              task_name: validation.data.task_name,
              status: validation.data.status,
              project_id: validation.data.project_id,
            },
          });
          res.status(201).json({ message: "successfully created tasks", data: createTaskQuery });
          break;
      }
    } catch (error) {
      console.log(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        res.status(400).json({ message: "Project does not exist" });
      }
    }
  },

  getAllTasks: async(req: Request, res: Response): Promise<void> => {
    try {
        const getAllTasksQuery = await prisma.tasks.findMany({
            include: {
                projects: true
            }
        });
        res.status(200).json({message: "data fetch successfully", data: getAllTasksQuery})
    } catch (error) {
        console.log(error);
    }
  },

  getParticularTask: async(req: Request, res:Response): Promise<void> => {
    try {
        const convertStringToNum = Number(req.params.id);
        switch(isNaN(convertStringToNum)){
            case true:
                res.status(400).json({message: "Invalid Task id"});
                break;
            default:
                const findParticularTaskQuery = await prisma.tasks.findUnique({
                    where: {
                        task_id: convertStringToNum
                    },
                    include: {
                        projects: {
                            include: {
                                users: true
                            }
                        }
                    }
                });
                switch(true){
                    case findParticularTaskQuery === null:
                        res.status(404).json({message: "Task not found"});
                        break;
                    default:
                        res.status(200).json({message: "data fetch successfully", data: findParticularTaskQuery})
                }
        }
    } catch (error) {
        console.log(error);
    }
  }
};
