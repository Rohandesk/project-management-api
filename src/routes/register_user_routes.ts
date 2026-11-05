import express from "express"
import {RegisterUserController} from "../controller/register_user_controller"
import {authHeader} from "../middleware/authHeader";

const registerUserRouter = express.Router();
registerUserRouter.post("/", RegisterUserController.registerUser);
registerUserRouter.post("/userlogin", RegisterUserController.userLogin);
registerUserRouter.get("/userme", authHeader, RegisterUserController.getLoggedInUserDetails);

export default registerUserRouter;