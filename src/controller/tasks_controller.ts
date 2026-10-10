import { PrismaClient, Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "../config/dotenv";
import { TasksSchema } from "../schema/tasks_schema";
import throwError from "../utils/throwError";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const TasksController = {
  createTasks: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validation = TasksSchema.safeParse(req.body);
      switch (validation.success) {
        case false:
          if (validation.error.issues[0].path == "status") {
            // res.status(400).json({
            //   message: "Status must be pending, in_progress, hold or completed",
            // });
            throwError(400 , "Status must be pending, in_progress, hold or completed", next);
          } else {
            // res
            //   .status(400)
            //   .json({ message: validation.error.issues[0].message });
            throwError(400 , validation.error.issues[0].message, next);
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
          res.status(201).json({
            message: "successfully created tasks",
            data: createTaskQuery,
          });
          break;
      }
    } catch (error) {
      // console.log(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        // res.status(400).json({ message: "Project does not exist" });
        throwError(400 , "Project does not exist", next);
      } else{
        throwError(500 , "Internal Server Error", next);
      }
    }
  },

  getAllTasks: async (req: Request, res: Response): Promise<void> => {
    try {
      const getAllTasksQuery = await prisma.tasks.findMany({
        include: {
          projects: true,
        },
      });
      res
        .status(200)
        .json({ message: "data fetch successfully", data: getAllTasksQuery });
    } catch (error) {
      // console.log(error);
      throwError(500 , "Internal Server Error", next);
    }
  },

  getParticularTask: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const convertStringToNum = Number(req.params.id);
      switch (isNaN(convertStringToNum)) {
        case true:
          // res.status(400).json({ message: "Invalid Task id" });
          throwError(400 , "Invalid Task id", next);
          break;
        default:
          const findParticularTaskQuery = await prisma.tasks.findUnique({
            where: {
              task_id: convertStringToNum,
            },
            include: {
              projects: {
                include: {
                  users: true,
                },
              },
            },
          });
          switch (true) {
            case findParticularTaskQuery === null:
              // res.status(404).json({ message: "Task not found" });
              throwError(404 , "Task not found", next);
              break;
            default:
              res.status(200).json({
                message: "data fetch successfully",
                data: findParticularTaskQuery,
              });
          }
      }
    } catch (error) {
      // console.log(error);
      throwError(500 , "Internal Server Error", next);
    }
  },

  updateTask: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const conversionNum = Number(req.params.id);
      switch (Number.isNaN(conversionNum)) {
        case true:
          // res.status(400).json({ message: "Invalid Task id" });
          throwError(400 , "Invalid Task id", next);
          break;
        default:
          const updateTaskData = TasksSchema.partial().refine(
            (data) => Object.keys(data).length > 0,
            {
              message: "At least one field is required to update",
            },
          );
          const validation = updateTaskData.safeParse(req.body);
          switch (validation.success) {
            case false:
              if (validation.error.issues[0].path == "status") {
                // res.status(400).json({
                //   message:
                //     "Status must be pending, in_progress, hold or completed",
                // });
                throwError(400 , "Status must be pending, in_progress, hold or completed", next);
              } else{
                // res
                //   .status(400)
                //   .json({ message: validation.error.issues[0].message });
                throwError(400 , validation.error.issues[0].message, next);
              }
              break;
            default:
              const UpdateTaskQuery = await prisma.tasks.update({
                where: {
                  task_id: conversionNum,
                },
                data: validation.data,
              });
              switch (true) {
                case UpdateTaskQuery === null:
                  res.status(404).json({ message: "Task not found" });
                  break;
                default:
                  res
                    .status(200)
                    .json({
                      message: "data updated successfully",
                      data: UpdateTaskQuery,
                    });
                  break;
              }
              break;
          }
      }
    } catch (error) {
      // console.log(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        // res.status(404).json({ message: "Task does not exist" });
        throwError(404 , "Task does not exist", next);
      } else if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        // res.status(400).json({ message: "Project does not exist" });
        throwError(400 , "Project does not exist", next);
      } else{
        throwError(500 , "Internal Server Error", next);
      }
    }
  },

  deleteTask: async (req: Request, res: Response: next: NextFunction): Promise<void> => {
    try {
      const convertStringToNum = Number(req.params.id);
      switch(Number.isNaN(convertStringToNum)){
        case true:
          // res.status(400).json({message: "Invalid Task id"});
          throwError(400 , "Invalid Task id", next);
          break;
        default:
          const DeleteTaskQuery = await prisma.tasks.delete({
            where: {
              task_id: convertStringToNum
            }
          })
          res.status(200).json({message: "task deleted successfully"});
          break;
      }
    } catch (error) {
      // console.log(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        // res.status(404).json({ message: "Task does not exist" });
        throwError(404 , "Task does not exist", next);
      } else{
        throwError(500 , "Internal Server Error", next);
      }
    }
  }
};
