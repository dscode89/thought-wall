import express from "express";
import dbInfo from "./database/connection";
import { User } from "./types/types";
const app = express();

app.get("/api/users", async (req, res, next) => {
  const usersCollection = dbInfo.database.collection<User>("Users");
  const currentUsers = await usersCollection.find().toArray();

  res.status(200).send({ users: currentUsers });
});

export default app;
