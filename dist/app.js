"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("./controllers/usersController");
const thoughtsController_1 = require("./controllers/thoughtsController");
const app = (0, express_1.default)();
app.get("/api/users", usersController_1.getUsers);
app.get("/api/thoughts", thoughtsController_1.getThoughts);
exports.default = app;
