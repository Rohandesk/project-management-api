import { PrismaClient, Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "../config/dotenv";
import { ProjectsSchema } from "../schema/projects_schema";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const ProjectsController = {
  createProjects: async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = ProjectsSchema.safeParse(req.body);
      switch (true) {
        case !validation.success:
          res.status(400).json({ message: validation.error.issues[0].message });
          break;
        default:
          const createProject = await prisma.projects.create({
            data: {
              project_name: validation.data.project_name,
              user_id: validation.data.user_id,
            },
          });
          res.status(201).json({
            message: "Project created successfully",
            data: createProject,
          });
          break;
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        res.status(400).json({ message: "User does not exist" });
      }
      console.log("error while creating projects", error);
    }
  },

  getAllProjects: async (req: Request, res: Response): Promise<void> => {
    try {
      const getAllProjects = await prisma.projects.findMany({
        include: {
          users: true,
        },
      });
      res.status(200).json({ message: "fetch all data", data: getAllProjects });
    } catch (error) {
      console.log(error);
    }
  },

  getParticularProject: async (req: Request, res: Response): Promise<void> => {
    try {
      const convertStringtoNum = Number(req.params.id);
      switch (true) {
        case isNaN(convertStringtoNum):
          res.status(400).json({ message: "Invalid id" });
          break;
        default:
          const projectData = await prisma.projects.findUnique({
            where: {
              project_id: convertStringtoNum,
            },
            include: {
              users: true,
            },
          });
          switch (true) {
            case projectData === null:
              res.status(404).json({ message: "Project id not found" });
              break;
            default:
              res.status(200).json({
                message: "Project data fetch successfully",
                data: projectData,
              });
              break;
          }
      }
    } catch (error) {
      console.log(error);
    }
  },

  updateProjectData: async (req: Request, res: Response): Promise<void> => {
    try {
      const convertStringtoNum = Number(req.params.id);
      switch (true) {
        case isNaN(convertStringtoNum):
          res.status(400).json({ message: "invalid project id" });
          break;
        default:
          const checkProjectExist = await prisma.projects.findUnique({
            where: {
              project_id: convertStringtoNum,
            },
          });
          console.log(checkProjectExist);
          switch (true) {
            case !checkProjectExist:
              res.status(404).json({ message: "Project not found" });
              break;
            default:
              const updateSchema = ProjectsSchema.partial().refine(
                (data) => Object.keys(data).length > 0,
                {
                  message: "At least one field is required to update",
                },
              );
              const validation = updateSchema.safeParse(req.body);
              switch (true) {
                case !validation.success:
                  res
                    .status(400)
                    .json({ message: validation.error.issues[0].message });
                  break;
                default:
                  const updateProjectQuery = await prisma.projects.update({
                    where: {
                      project_id: convertStringtoNum,
                    },
                    data: validation.data,
                  });
                  res.status(200).json({
                    message: "Project data updated successfully",
                    data: updateProjectQuery,
                  });
                  break;
              }
          }
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        res.status(400).json({ message: "User does not exist" });
      }
      console.log(error);
    }
  },

  deleteProject: async (req: Request, res: Response): Promise<void> => {
    try {
      const convertStringtoNum = Number(req.params.id);
      switch (true) {
        case isNaN(convertStringtoNum):
          res.status(400).json({ message: "invalid project id" });
          break;
        default:
          const checkProjectExist = await prisma.projects.findUnique({
            where: {
              project_id: convertStringtoNum,
            },
          });
          switch (true) {
            case !checkProjectExist:
              res.status(404).json({ message: "Project not found" });
              break;
            default:
              const deleteProjectQuery = await prisma.projects.delete({
                where: {
                    project_id: convertStringtoNum
                }
              });
              res.status(200).json({message: "Project deleted successfully"});
          }
      }
    } catch (error) {
      console.log(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        res.status(409).json({ message: "Project cannot be deleted because tasks are assigned to it" });
      }
    }
  },
};
