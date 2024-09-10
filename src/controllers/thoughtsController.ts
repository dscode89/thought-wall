import { NextFunction, RequestHandler, Response, Request } from "express";
import { fetchThoughts } from "../models/thoughtsModel";

export const getThoughts: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentThoughts = await fetchThoughts();
  res.status(200).send({ thoughts: currentThoughts });
};
