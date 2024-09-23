import express, { NextFunction } from "express";
import {
  getUsers,
  postUser,
  deleteUser,
  updateUserDetails,
  getUserByUserId,
} from "./controllers/usersController";
import {
  getThoughts,
  postThought,
  deleteThoughtsByUserId,
  updateThoughtDetails,
  getThoughtById,
  deleteThoughtById,
  getThoughtsByUserId,
} from "./controllers/thoughtsController";
import {
  uncaughtErrorHandler,
  customErrorHandler,
  mondoDbErrors,
} from "./errors/errors";
import endpointData from "./api.json";

const app = express();

app.use(express.json());

app.get("/api/home", (req, res, next) => {
  console.log("in here");
  res.status(200).send({ apiInfo: endpointData });
});
//users
app.get("/api/users", getUsers);
app.post("/api/users", postUser);
app.get("/api/users/:user_id", getUserByUserId);
app.delete("/api/users/:user_id", deleteUser);
app.patch("/api/users/:user_id", updateUserDetails);
//thoughts
app.get("/api/thoughts", getThoughts);
app.get("/api/thoughts/:thought_id", getThoughtById);
app.get("/api/thoughts/users/:user_id", getThoughtsByUserId);
app.post("/api/thoughts", postThought);
app.delete("/api/thoughts/:thought_id", deleteThoughtById);
app.delete("/api/thoughts/users/:user_id", deleteThoughtsByUserId);
app.patch("/api/thoughts/:thought_id", updateThoughtDetails);

//error handling
app.use(customErrorHandler);
app.use(mondoDbErrors);
app.use(uncaughtErrorHandler);
export default app;
