import express from "express";
import {ProjectsController} from "../controller/projects_controller";

const projectRouter = express.Router();
projectRouter.post("", ProjectsController.createProjects);
projectRouter.get("/", ProjectsController.getAllProjects);
projectRouter.get("/:id", ProjectsController.getParticularProject);
projectRouter.patch("/:id", ProjectsController.updateProjectData);
projectRouter.delete("/:id", ProjectsController.deleteProject);

export default projectRouter;