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
    if (err.message ===
        "input must be a 24 character hex string, 12 byte Uint8Array, or an integer") {
        res.status(400).send({ errorMsg: "400 - invalid user id" });
    }
    else {
        next(err);
    }
};
exports.mondoDbErrors = mondoDbErrors;
const uncaughtErrorHandler = (err, req, res, next) => {
    res.status(500).send({ msg: "Server is currently broken" });
};
exports.uncaughtErrorHandler = uncaughtErrorHandler;
