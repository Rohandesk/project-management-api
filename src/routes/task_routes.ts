import express from "express";
import {TasksController} from "../controller/tasks_controller";

const taskRouter = express.Router();

taskRouter.post("/", TasksController.createTasks);
export default taskRouter;