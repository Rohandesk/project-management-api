import dotenv from "../config/dotenv"
import jwt from "jsonwebtoken";

export const verifyJwtToken = async(passedToken: string) => {
    try {
        const result = jwt.verify(passedToken, process.env.JWT_ACCESS_SECRET);
        return {result: true, data: result};
    } catch (error) {
        return {result : false};
    }
}