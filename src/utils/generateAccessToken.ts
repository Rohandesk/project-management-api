import jwt from "jsonwebtoken";
import dotenv from "../config/dotenv";
import throwError from "../utils/throwError";


export interface TokenPayload{
    user_id: number;
    user_email: string;
    user_name: string;
}

export const generateAccessToken = (
    payload: TokenPayload
): string => {
    const secretKey = process.env.JWT_ACCESS_SECRET

    if(!secretKey){
        throwError("JWT_SECRET is not defined in the environment variables");
    }
    try {
        return jwt.sign(payload, secretKey, {
            expiresIn: process.env.TOKENEXPIRESIN
        })
    } catch (error) {
        console.log(error);
    }

}