import { NextFunction, RequestHandler, Response, Request } from "express";
import { fetchThoughts } from "../models/thoughtsModel";
import { Db } from "mongodb";

export const getThoughts: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mongoDb: Db = req.app.get("mongoDb");
  const currentThoughts = await fetchThoughts(mongoDb);
  res.status(200).send({ thoughts: currentThoughts });
};
