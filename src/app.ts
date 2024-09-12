import express from "express";
import { getUsers, postUser } from "./controllers/usersController";
import { getThoughts } from "./controllers/thoughtsController";

const app = express();

app.use(express.json());

//users
app.get("/api/users", getUsers);
app.post("/api/users", postUser);
//thoughts
app.get("/api/thoughts", getThoughts);

export default app;
