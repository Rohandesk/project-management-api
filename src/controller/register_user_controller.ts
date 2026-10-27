import { PrismaClient, Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "../config/dotenv";
import { registerUserSchema } from "../schema/register_user_schema";
import throwError from "../utils/throwError";
import { comparePassword, hashPassword } from "../utils/crypto";
import {LoginUserSchema} from "../schema/login_schema";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const RegisterUserController = {
  registerUser: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validation = registerUserSchema.safeParse(req.body);
      switch (validation.success) {
        case false:
          throwError(400, validation.error.issues[0].message, next);
          break;
        default:
          const checkUserExistance = await prisma.users.findUnique({
            where: {
              user_email: validation.data.user_email,
            },
          });
          switch (true) {
            case checkUserExistance !== null:
              throwError(409, "User already exist with this email", next);
              break;
            default:
              const convertpassword = await hashPassword(
                validation.data.password,
              );
              const registerUserQuery = await prisma.users.create({
                data: {
                  user_name: validation.data.user_name,
                  user_email: validation.data.user_email,
                  user_phone: validation.data.user_phone,
                  password_hash: convertpassword,
                },
              });
              const newRegisterData = {
                user_id: registerUserQuery.user_id,
                user_name: registerUserQuery.user_name,
                user_email: registerUserQuery.user_email,
                user_phone: registerUserQuery.user_phone,
              };
              res
                .status(201)
                .json({
                  message: "User registered successfully",
                  data: newRegisterData,
                });
              break;
          }
          break;
      }
    } catch (error) {
      throwError(500, "Internal Server Error", next);
    }
  },

  userLogin: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validation = LoginUserSchema.safeParse(req.body);
      switch (validation.success) {
        case false:
          throwError(400, validation.error.issues[0].message, next);
          break;
        default:
          const findEneteredEmail = await prisma.users.findUnique({
            where: {
              user_email: validation.data.user_email,
            },
          });
          switch (findEneteredEmail) {
            case null:
              throwError(401, "Invalid email or password", next);
              break;
            default:
              const passwordComapre = await comparePassword(
                validation.data.password,
                findEneteredEmail.password_hash,
              );
              switch (passwordComapre) {
                case false:
                  throwError(401, "Invalid email or password", next);
                  break;
                default:
                  res
                    .status(200)
                    .json({ message: "User logged in successfully" });
                  break;
              }
              break;
          }
      }
    } catch (error) {
      console.log(error);
      throwError(500, "Internal Server Error", next);
    }
  },
};
