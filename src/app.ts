import express from "express";
import { getUsers, postUser, deleteUser } from "./controllers/usersController";
import {
  getThoughts,
  postThought,
  deleteThought,
  deleteThoughtsByUserId,
  updateThoughtDetails,
} from "./controllers/thoughtsController";

const app = express();

app.use(express.json());

//users
app.get("/api/users", getUsers);
app.post("/api/users", postUser);
app.delete("/api/users/:user_id", deleteUser);
//thoughts
app.get("/api/thoughts", getThoughts);
app.post("/api/thoughts", postThought);
app.delete("/api/thoughts/:thought_id", deleteThought);
app.delete("/api/thoughts/users/:user_id", deleteThoughtsByUserId);
app.patch("/api/thoughts/:thought_id", updateThoughtDetails);

export default app;
