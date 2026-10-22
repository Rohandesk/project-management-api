import express from "express";
import {ProjectMembersController} from "../controller/project_members_controller";

const projectMembersRouter = express.Router();

projectMembersRouter.post("/", ProjectMembersController.createProjectWithMember);

export default projectMembersRouter;