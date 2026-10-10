import express from "express";
import {TasksController} from "../controller/tasks_controller";

const taskRouter = express.Router();

taskRouter.post("/", TasksController.createTasks);
taskRouter.get("/", TasksController.getAllTasks);
taskRouter.get("/:id", TasksController.getParticularTask);
taskRouter.patch("/:id", TasksController.updateTask);
export default taskRouter;