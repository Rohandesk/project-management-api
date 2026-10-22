import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "../config/dotenv";
import { UserProfileSchema } from "../schema/userProfile_schema";
import throwError from "../utils/throwError";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const UserProfileController = {
  createUserProfile: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validation = UserProfileSchema.safeParse(req.body);
      switch (validation.success) {
        case false:
          throwError(400, validation.error.issues[0].message, next);
          break;
        default:
          const checkUserExist = await prisma.users.findUnique({
            where: {
              user_id: validation.data.user_id,
            },
          });
          switch (checkUserExist) {
            case null:
              throwError(404, "User does not exist", next);
              break;
            default:
              const createUserProfileQuery = await prisma.user_profile.create({
                data: {
                  user_id: validation.data.user_id,
                  bio: validation.data.bio,
                },
              });
              res
                .status(201)
                .json({
                  message: "User profile created successfully",
                  data: createUserProfileQuery,
                });
              break;
          }
          break;
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        // res.status(404).json({ message: "Task does not exist" });
        throwError(409, "User profile already exist", next);
      } else {
        throwError(500, "Internal Server Error", next);
      }
    }
  },
};
