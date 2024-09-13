import { NextFunction, RequestHandler, Response, Request } from "express";
import { fetchThoughts, createThought } from "../models/thoughtsModel";
import { Db, ObjectId } from "mongodb";

export const getThoughts: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mongoDb: Db = req.app.get("mongoDb");
  const currentThoughts = await fetchThoughts(mongoDb);
  res.status(200).send({ thoughts: currentThoughts });
};

export const postThought: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.body._userId;
  const currentUserIdClassConversion = new ObjectId(currentUserId);

  req.body._userId = currentUserIdClassConversion;

  try {
    const mongoDb: Db = req.app.get("mongoDb");
    const newThought = await createThought(mongoDb, req.body);
    res.status(201).send({ thought: newThought });
  } catch (error) {
    next(error);
  }
};
