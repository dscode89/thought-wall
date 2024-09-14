import { NextFunction, Response, Request } from "express";
import {
  fetchThoughts,
  createThought,
  removeThought,
  removeThoughtsByUserId,
  amendThoughtDetails,
} from "../models/thoughtsModel";
import { Db, ObjectId } from "mongodb";

export const getThoughts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mongoDb: Db = req.app.get("mongoDb");
  const currentThoughts = await fetchThoughts(mongoDb);
  res.status(200).send({ thoughts: currentThoughts });
};

export const postThought = async (
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

export const deleteThought = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const thoughtId = req.params.thought_id;
    const mongoDb: Db = req.app.get("mongoDb");
    await removeThought(mongoDb, thoughtId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const deleteThoughtsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.user_id;
    const mongoDb: Db = req.app.get("mongoDb");
    await removeThoughtsByUserId(mongoDb, userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateThoughtDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const thoughtId = req.params.thought_id;
    const updateDatails = req.body;

    const mongoDb: Db = req.app.get("mongoDb");
    const updatedThought = await amendThoughtDetails(
      mongoDb,
      thoughtId,
      updateDatails
    );

    res.status(200).send({ thought: updatedThought });
  } catch (error) {
    next(error);
  }
};
