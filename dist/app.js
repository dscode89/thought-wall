"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("./controllers/usersController");
const thoughtsController_1 = require("./controllers/thoughtsController");
const errors_1 = require("./errors/errors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
//users
app.get("/api/users", usersController_1.getUsers);
app.post("/api/users", usersController_1.postUser);
app.get("/api/users/:user_id", usersController_1.getUserByUserId);
app.delete("/api/users/:user_id", usersController_1.deleteUser);
app.patch("/api/users/:user_id", usersController_1.updateUserDetails);
//thoughts
app.get("/api/thoughts", thoughtsController_1.getThoughts);
app.post("/api/thoughts", thoughtsController_1.postThought);
app.delete("/api/thoughts/:thought_id", thoughtsController_1.deleteThought);
app.delete("/api/thoughts/users/:user_id", thoughtsController_1.deleteThoughtsByUserId);
app.patch("/api/thoughts/:thought_id", thoughtsController_1.updateThoughtDetails);
//error handling
app.use(errors_1.customErrorHandler);
app.use(errors_1.mondoDbErrors);
app.use(errors_1.uncaughtErrorHandler);
exports.default = app;
