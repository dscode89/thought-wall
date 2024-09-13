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
exports.deleteThoughtsByUserId = exports.deleteThought = exports.postThought = exports.getThoughts = void 0;
const thoughtsModel_1 = require("../models/thoughtsModel");
const mongodb_1 = require("mongodb");
const getThoughts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const mongoDb = req.app.get("mongoDb");
    const currentThoughts = yield (0, thoughtsModel_1.fetchThoughts)(mongoDb);
    res.status(200).send({ thoughts: currentThoughts });
});
exports.getThoughts = getThoughts;
const postThought = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.body._userId;
    const currentUserIdClassConversion = new mongodb_1.ObjectId(currentUserId);
    req.body._userId = currentUserIdClassConversion;
    try {
        const mongoDb = req.app.get("mongoDb");
        const newThought = yield (0, thoughtsModel_1.createThought)(mongoDb, req.body);
        res.status(201).send({ thought: newThought });
    }
    catch (error) {
        next(error);
    }
});
exports.postThought = postThought;
const deleteThought = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thoughtId = req.params.thought_id;
        const mongoDb = req.app.get("mongoDb");
        yield (0, thoughtsModel_1.removeThought)(mongoDb, thoughtId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteThought = deleteThought;
const deleteThoughtsByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.user_id;
        const mongoDb = req.app.get("mongoDb");
        yield (0, thoughtsModel_1.removeThoughtsByUserId)(mongoDb, userId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteThoughtsByUserId = deleteThoughtsByUserId;
