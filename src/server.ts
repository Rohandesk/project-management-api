import express from "express";
import dotenv from "./config/dotenv";
import usersRouter from "../src/routes/users_routes";

const app = express();
const port = process.env.PORT
app.use(express.json());
app.use("/users", usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})