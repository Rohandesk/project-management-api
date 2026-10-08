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
          res
            .status(201)
            .json({
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
        res
          .status(400)
          .json({ message: "User does not exist" });
      }
      console.log("error while creating projects", error);
    }
  },

  getAllProjects: async(req: Request, res: Response): Promise<void> => {
    try {
        const getAllProjects = await prisma.projects.findMany({
            include: {
                users: true
            }
        })
        res.status(200).json({message: "fetch all data", data: getAllProjects})
    } catch (error) {
        console.log(error);
    }
  }
};
