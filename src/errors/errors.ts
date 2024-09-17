import { ErrorRequestHandler, NextFunction, Response, Request } from "express";
import { MongoBulkWriteError, MongoServerError } from "mongodb";

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
  err: Error & MongoServerError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    err.message ===
    "input must be a 24 character hex string, 12 byte Uint8Array, or an integer"
  ) {
    res.status(400).send({ errorMsg: "400 - invalid id provided" });
  } else if (err.code === 121) {
    res.status(400).send({
      errorMsg:
        "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
    });
  } else {
    next(err);
  }
};

export const uncaughtErrorHandler: ErrorRequestHandler = (
  err: Error & MongoBulkWriteError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err, "<-- uncaught error");
  res.status(500).send({ msg: "Server is currently broken" });
};
