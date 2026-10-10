import {Request , Response, NextFunction} from "express";
export const ApiLogger = (req: Request , res: Response, next: NextFunction) => {
    res.on('finish', () => {
        console.log(`Api Request: ${req.originalUrl}, Methond: ${req.method}, Status: ${res.statusCode}`);
    })
    next();
}