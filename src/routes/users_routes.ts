import express from "express";
import {UsersController} from "../controller/users_controller";

const usersRouter = express.Router();
usersRouter.get("/", UsersController.getUsers);
export default usersRouter;