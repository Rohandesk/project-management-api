import { PrismaClient, Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "../config/dotenv";
import { UserSchema } from "../schema/user_schema";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const UsersController = {
  getUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const getAllUsers = await prisma.users.findMany();
      res.status(200).json(getAllUsers);
    } catch (error) {
      console.log(error);
    }
  },

  getParticularUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const conversion = Number(req.params.id);
      switch (true) {
        case isNaN(conversion):
          res.status(400).json({ message: "Invalid id" });
          break;
        default:
          const getAllUsers = await prisma.users.findUnique({
            where: {
              user_id: conversion,
            },
          });
          switch (true) {
            case !getAllUsers:
              res.status(404).json({ message: "User not found" });
              break;
            default:
              res.status(200).json(getAllUsers);
              break;
          }
      }
    } catch (error) {
      console.log(error);
    }
  },

  createUser: async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
  ): Promise<void> => {
    try {
      const validation = UserSchema.safeParse(req.body);
      switch (true) {
        case !validation.success:
          res.status(400).json({ message: validation.error.issues[0].message });
          break;
        default:
          const existingUser = await prisma.users.findUnique({
            where: {
              user_email: req.body.user_email,
            },
          });
          if (existingUser) {
            res.status(400).json({ message: "User already exists" });
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
      console.log(error);
    }
  },

  updateUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const existing = await prisma.users.findUnique({
        where: {
          user_id: Number(req.params.id),
        },
      });
      switch (true) {
        case !existing:
          res.status(404).json({ message: "User not found" });
          break;
        default:
          const updateSchema = UserSchema.partial();
          const validation = updateSchema.safeParse(req.body);
          switch (true) {
            case !validation.success:
              res
                .status(400)
                .json({ message: validation.error.issues[0].message });
              break;
            default:
              const updatedQuery = await prisma.users.update({
                where: {
                  user_id: Number(req.params.id),
                },
                data: req.body,
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
        res.status(400).json({message: "User with this email already exists"});
      }

      console.log("error comes here", error);
    }
  },
};
