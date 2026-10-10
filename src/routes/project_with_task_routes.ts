import express from "express";
import {ProjectWithTaskController} from "../controller/project_with_task";

const projectTaskRouter = express.Router();

projectTaskRouter.post("/", ProjectWithTaskController.createProjectWithTask);

export default projectTaskRouter;