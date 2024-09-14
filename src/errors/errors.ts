import { ErrorRequestHandler, NextFunction, Response, Request } from "express";

export const customErrorHandler: ErrorRequestHandler = (
  err: Error & { status: number; errorMsg: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status) {
    res.status(err.status).send({ errorMsg: err.errorMsg });
  } else {
    next(err);
  }
};

export const mondoDbErrors: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    err.message ===
    "input must be a 24 character hex string, 12 byte Uint8Array, or an integer"
  ) {
    res.status(400).send({ errorMsg: "400 - invalid user id" });
  } else {
    next(err);
  }
};

export const uncaughtErrorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).send({ msg: "Server is currently broken" });
};
