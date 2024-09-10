import express from "express";
import dbInfo from "./database/connection";
import { User, Thought } from "./types/types";
import { getUsers } from "./controllers/usersController";
import { getThoughts } from "./controllers/thoughtsController";
const app = express();

app.get("/api/users", getUsers);
app.get("/api/thoughts", getThoughts);

export default app;
