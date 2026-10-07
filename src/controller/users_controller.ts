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
    },

    getParticularUser: async (req:Request, res: Response) : Promise<void> => {
        try {
            console.log(`getUsers called  ${req.params.id}`, typeof req.params.id);
            const conversion = Number(req.params.id);
            switch(true){
                case isNaN(conversion):
                    res.status(400).json({message: "Invalid id"});
                    break;
                default:
                    const getAllUsers = await prisma.users.findUnique({
                        where: {
                            user_id: conversion
                        }
                    });
                    switch(true){
                        case !getAllUsers:
                            res.status(404).json({message:"User not found"});
                            break;
                        default:
                            res.status(200).json(getAllUsers);
                            break;
                    }
            }
        } catch (error) {
            console.log(error);
        }
    }
}