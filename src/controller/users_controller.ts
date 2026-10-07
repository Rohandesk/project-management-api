import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export const UsersController = {
    getUsers: async (req:Request, res: Response) : Promise<void> => {
        try {
            console.log("getUsers called");
            const getAllUsers = await prisma.users.findMany();
        } catch (error) {
            console.log(error);
        }
    }
}