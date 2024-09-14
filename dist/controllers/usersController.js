"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserDetails = exports.deleteUser = exports.postUser = exports.getUsers = void 0;
const usersModel_1 = require("../models/usersModel");
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoDb = req.app.get("mongoDb");
        const currentUsers = yield (0, usersModel_1.fetchUsers)(mongoDb);
        res.status(200).send({ users: currentUsers });
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
const postUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoDb = req.app.get("mongoDb");
        const newUser = yield (0, usersModel_1.createUser)(mongoDb, req.body);
        res.status(201).send({ user: newUser });
    }
    catch (error) {
        next(error);
    }
});
exports.postUser = postUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.user_id;
        const mongoDb = req.app.get("mongoDb");
        yield (0, usersModel_1.removeUser)(mongoDb, userId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
const updateUserDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.user_id;
        const mongoDb = req.app.get("mongoDb");
        const updateDatails = req.body;
        const updatedUser = yield (0, usersModel_1.amendUserDetails)(mongoDb, userId, updateDatails);
        res.status(200).send({ user: updatedUser });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserDetails = updateUserDetails;
