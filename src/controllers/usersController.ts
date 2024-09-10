import { NextFunction, RequestHandler, Response, Request } from "express";
import { fetchUsers } from "../models/usersModel";

export const getUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUsers = await fetchUsers();

  res.status(200).send({ users: currentUsers });
};
