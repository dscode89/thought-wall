import { NextFunction, RequestHandler, Response, Request } from "express";
import { fetchUsers } from "../models/usersModel";
import { Db } from "mongodb";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mongoDb: Db = req.app.get("mongoDb");
    const currentUsers = await fetchUsers(mongoDb);

    res.status(200).send({ users: currentUsers });
  } catch (error) {
    next(error);
  }
};
