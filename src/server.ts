import express from "express";
import dotenv from "dotenv";
import usersRouter from "../src/routes/users_routes";

const app = express();
dotenv.config();
const port = process.env.PORT
app.use(express.json());
app.use("/users", usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})