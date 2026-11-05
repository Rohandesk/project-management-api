import  throwError  from "../utils/throwError";
import { verifyJwtToken } from "./verifyToken";

export const authHeader = async ( req: Request,res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    switch (true) {
        case !authHeader || !authHeader.startsWith('Bearer '):
            throwError(401, "Access denied. No token provided.", next);
            break;
        case !token:
            throwError(401, "Access denied. No token provided.", next);
            break;
        default:
            const result = await verifyJwtToken(token);
            switch (result.result) {
                case false:
                    throwError(401, "Unauthorized Access", next);
                    break;
                default:
                    req.user_id = result.data.user_id;
                    return next();
                    break;
            }
    }
}