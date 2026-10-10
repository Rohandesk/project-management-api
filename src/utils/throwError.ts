import { Request, Response, NextFunction } from 'express';
const throwError = (statusCode: number, message: string, next: NextFunction): void => {
    next({ statusCode, message });
}

export default throwError;