import {PrismaClient} from "../../generated/prisma/client";
import {PrismaPg } from "@prisma/adapter-pg";
import dotenv from "../config/dotenv";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});
const prisma = new PrismaClient({ adapter });

export const UsersController = {
    getUsers: async (req:Request, res: Response) : Promise<void> => {
        try {
            console.log("getUsers called");
            const getAllUsers = await prisma.users.findMany();
            res.status(200).json(getAllUsers);
        } catch (error) {
            console.log(error);
        }
    }
}