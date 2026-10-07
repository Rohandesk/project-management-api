import express from "express";
import {UsersController} from "../controller/users_controller";

const usersRouter = express.Router();
usersRouter.get("/", UsersController.getUsers);
usersRouter.get("/:id", UsersController.getParticularUser);
usersRouter.post("/", UsersController.createUser);
export default usersRouter;