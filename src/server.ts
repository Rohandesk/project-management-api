import express from "express";
import dotenv from "./config/dotenv";
import usersRouter from "../src/routes/users_routes";
import projectRouter from "./routes/projects_routes";
import taskRouter from "./routes/task_routes";
import projectTaskRouter from "./routes/project_with_task_routes";

const app = express();
const port = process.env.PORT
app.use(express.json());
app.use("/users", usersRouter);
app.use("/projects", projectRouter);
app.use("/tasks", taskRouter);
app.use("/project-with-task", projectTaskRouter);

app.use((req,res) => {
    res.status(404).json({message: "Route not found"});
});

app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})