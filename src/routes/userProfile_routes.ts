import express from "express";
import {UserProfileController} from "../controller/userProfile_controller"

const userProfileRouter = express.Router();

userProfileRouter.post("/", UserProfileController.createUserProfile);

export default userProfileRouter;