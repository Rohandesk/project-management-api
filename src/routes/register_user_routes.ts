import express from "express"
import {RegisterUserController} from "../controller/register_user_controller"

const registerUserRouter = express.Router();
registerUserRouter.post("/", RegisterUserController.registerUser);

export default registerUserRouter;