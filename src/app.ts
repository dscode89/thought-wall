import express from "express";
import dbInfo from "./database/connection";
import { User } from "./types/types";
const app = express();

app.get("/api/users", async (req, res, next) => {
  // get the Users collection from chosen database
  const usersCollection = dbInfo.database.collection<User>("Users");
  // this will return a cluster object so use toArray() to give you an array of users
  const currentUsers = await usersCollection.find().toArray();
  //send it back
  res.status(200).send({ users: currentUsers });
});

export default app;
