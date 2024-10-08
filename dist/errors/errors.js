"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uncaughtErrorHandler = exports.mondoDbErrors = exports.customErrorHandler = void 0;
const customErrorHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ errorMsg: err.errorMsg });
    }
    else {
        next(err);
    }
};
exports.customErrorHandler = customErrorHandler;
const mondoDbErrors = (err, req, res, next) => {
    if (err.code === 121 ||
        err.message.includes("Illegal arguments:") ||
        err.message === "Argument passed in does not match the accepted types" ||
        err.message ===
            "input must be a 24 character hex string, 12 byte Uint8Array, or an integer") {
        res.status(400).send({
            errorMsg: "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
        });
    }
    else {
        next(err);
    }
};
exports.mondoDbErrors = mondoDbErrors;
const uncaughtErrorHandler = (err, req, res, next) => {
    console.log(err.message, "<-- uncaught error");
    res.status(500).send({ msg: "Server is currently broken" });
};
exports.uncaughtErrorHandler = uncaughtErrorHandler;
