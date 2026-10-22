// import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "../config/dotenv";
import { ProjectMembersSchema } from "../schema/project_members_schema";
import throwError from "../utils/throwError";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const ProjectMembersController = {
  createProjectWithMember: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      console.log("receive contact", req.body);
      const validation = ProjectMembersSchema.safeParse(req.body);
      switch (validation.success) {
        case false:
          throwError(400, validation.error.issues[0].message, next);
          break;
        default:
        //   console.log(validation.data);
        const checkUserId = await prisma.users.findUnique({
            where: {
                user_id :  validation.data.user_id
            }
        });
        const checkProjectId = await prisma.projects.findUnique({
            where: {
                project_id :  validation.data.project_id
            }
        });
        switch(true){
            case checkUserId === null && checkProjectId === null:
                throwError(404, "User and Project both does not exist", next);
                break;
            case checkUserId === null:
                throwError(404, "User does not exist", next);
                break;
            case checkProjectId === null:
                throwError(400, "Project does not exist", next);
                break;
            default:
                const createProjectWithMember = await prisma.project_members.create({
                  data: {
                    user_id: validation.data.user_id,
                    project_id: validation.data.project_id,
                  },
                });
                res.status(201).json({ message: "Project with member created", data: createProjectWithMember });
                break;
        }
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throwError(409, "User is already a member of this project", next);
      } else if(error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"){
            throwError(409, "Invalid user_id or project_id", next);
        } else {
        throwError(500, "Internal Server Error", next);
      }
    }
  },
};
