import express from "express";
import {ProjectsController} from "../controller/projects_controller";

const projectRouter = express.Router();
projectRouter.post("", ProjectsController.createProjects);
projectRouter.get("/", ProjectsController.getAllProjects);
projectRouter.get("/:id", ProjectsController.getParticularProject);

export default projectRouter;