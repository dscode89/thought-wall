import { NextFunction, Response, Request } from "express";
import {
  fetchThoughts,
  createThought,
  removeThoughtById,
  removeThoughtsByUserId,
  amendThoughtDetails,
  fetchThoughtById,
  fetchThoughtsByUserId,
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

export const getThoughtById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mongoDb: Db = req.app.get("mongoDb");
    const id = req.params.thought_id;
    const requestedThought = await fetchThoughtById(mongoDb, id);
    res.status(200).send({ thought: requestedThought });
  } catch (error) {
    next(error);
  }
};

export const getThoughtsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.user_id;
    const mongoDb: Db = req.app.get("mongoDb");
    const requestedThoughts = await fetchThoughtsByUserId(mongoDb, id);

    res.status(200).send({ thoughts: requestedThoughts });
  } catch (error) {
    next(error);
  }
};

export const postThought = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = req.body.userId;

    /* if no userId provided on request body, then don't add that property to the request body
         - this will fail the validation set up on the mongoDb schema for the test database
    */
    if (currentUserId) {
      const currentUserIdClassConversion = new ObjectId(currentUserId);
      req.body.userId = currentUserIdClassConversion;
    }

    const mongoDb: Db = req.app.get("mongoDb");
    const newThought = await createThought(mongoDb, req.body);
    res.status(201).send({ thought: newThought });
  } catch (error) {
    next(error);
  }
};

export const deleteThoughtById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const thoughtId = req.params.thought_id;
    const mongoDb: Db = req.app.get("mongoDb");
    await removeThoughtById(mongoDb, thoughtId);

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
