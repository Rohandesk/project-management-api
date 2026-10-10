import { PrismaClient, Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "../config/dotenv";
import { UserSchema } from "../schema/user_schema";
import throwError from "../utils/throwError";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const UsersController = {
  getUsers: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const getAllUsers = await prisma.users.findMany({
        include: {
          projects: true
        }
      });
      res.status(200).json(getAllUsers);
    } catch (error) {
      // console.log(error);
      throwError(500 , "Internal Server Error", next);
    }
  },

  getParticularUser: async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const conversion = Number(req.params.id);
      switch (true) {
        case isNaN(conversion):
          // res.status(400).json({ message: "Invalid id" });
          throwError(400 , "Invalid id", next);
          break;
        default:
          const getAllUsers = await prisma.users.findUnique({
            where: {
              user_id: conversion,
            },
            include: {
              projects: true
            }
          });
          switch (true) {
            case !getAllUsers:
              // res.status(404).json({ message: "User not found" });
              throwError(404 , "User not found", next);
              break;
            default:
              res.status(200).json(getAllUsers);
              break;
          }
      }
    } catch (error) {
      // console.log(error);
      throwError(500 , "Internal Server Error", next);
    }
  },

  createUser: async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validation = UserSchema.safeParse(req.body);
      switch (true) {
        case !validation.success:
          // res.status(400).json({ message: validation.error.issues[0].message });
          throwError(400 , validation.error.issues[0].message, next);
          break;
        default:
          const existingUser = await prisma.users.findUnique({
            where: {
              user_email: req.body.user_email,
            },
          });
          if (existingUser) {
            // res.status(409).json({ message: "User already exists with email" });
            throwError(409 , "User already exists with email", next);
            return;
          }
          const newUser = await prisma.users.create({
            data: {
              user_name: validation.data.user_name,
              user_email: validation.data.user_email,
            },
          });
          res
            .status(201)
            .json({ data: newUser, message: "User created successfully" });
        // console.log(validation.data, newUser);
      }
    } catch (error) {
      // console.log(error);
      throwError(500 , "Internal Server Error", next);
    }
  },

  updateUsers: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const existing = await prisma.users.findUnique({
        where: {
          user_id: Number(req.params.id),
        },
      });
      switch (true) {
        case !existing:
          // res.status(404).json({ message: "User not found" });
          throwError(404 , "User not found", next);
          break;
        default:
          const updateSchema = UserSchema.partial();
          const validation = updateSchema.safeParse(req.body);
          switch (true) {
            case !validation.success:
              // res
              //   .status(400)
              //   .json({ message: validation.error.issues[0].message });
                throwError(400 , validation.error.issues[0].message, next);
              break;
            default:
              const updatedQuery = await prisma.users.update({
                where: {
                  user_id: Number(req.params.id),
                },
                data: validation.data,
              });

              res
                .status(200)
                .json({ message: "user data updated successfully" });
          }
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        // res.status(409).json({message: "User with this email already exists"});
        throwError(409 , "User with this email already exists", next);
      } else{
        throwError(500 , "Internal Server Error", next);
      }
    }
  },

  deleteUser: async (req: Request, res: Response, next: NextFunction): Promise <void> => {
    try {
      const idConversion = Number(req.params.id);
      switch(true){
        case isNaN(idConversion):
          // res.status(400).json({message: "Invalid Id"});
          throwError(400 , "Invalid id", next);
          break;
        default:
          const checkIdExist = await prisma.users.findUnique({
            where: {
              user_id: idConversion
            }
          })
          switch(true){
            case !checkIdExist:
              // res.status(404).json({message: "User not found"});
              throwError(404 , "User not found", next);
              break;
            default:
              const deleteUser = await prisma.users.delete({
                where: {
                  user_id: idConversion,
                }
              })
              res.status(200).json({message: "User deleted successfully"});
          }
      }
    } catch (error) {
      // console.log("error comes here", error);
      throwError(500 , "Internal Server Error", next);
    }
  },

  deleteBulkUsers: async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      // filtering only ids here and removing invaid strings
      const cleanIds = req.body.user_ids.filter((id: string) => Number(id));
      switch(true){
        case cleanIds.length == 0:
          // res.status(400).json({message: "No valid user ids provided"});
          throwError(400 , "No valid user ids provided", next);
          break;
        default:
          // cleanIds contains proper ids which are later converted into numbers stored in array and passed for deletion
          const numConversion = cleanIds.map((id: string) => Number(id));
          const deleteUsersIds = await prisma.users.deleteMany({
            where: {
              user_id: {
                in: numConversion
              }
            }
          })
          res.status(200).json({ message: "Users deleted successfully"});
          break;
      }
    } catch (error) {
      // console.log("error comes here", error);
       throwError(500 , "Internal Server Error", next);
    }
  },

  getDedicatedProject: async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findProject = await prisma.users.findMany({
        include: {
          projects: true
        }
      })
      res.status(200).json({message: "fetch", data: findProject})
    } catch (error) {
      // console.log(error);
       throwError(500 , "Internal Server Error", next);
    }
  }
};
