import {Request , Response, NextFunction} from "express";
export const ApiLogger = (req: Request , res: Response, next: NextFunction) => {
    console.log(`Api Request: ${req.url}, Methond: ${req.method}, Status: ${res.statusCode}`);
    next();
}