import { NextFunction, RequestHandler, Response, Request } from "express";
import { fetchUsers, createUser, removeUser } from "../models/usersModel";
import { Db } from "mongodb";

export const getUsers: RequestHandler = async (
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

export const postUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mongoDb: Db = req.app.get("mongoDb");
    const newUser = await createUser(mongoDb, req.body);

    res.status(201).send({ user: newUser });
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.user_id;
    const mongoDb: Db = req.app.get("mongoDb");
    await removeUser(mongoDb, userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
