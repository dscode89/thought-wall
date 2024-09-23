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
exports.updateThoughtDetails = exports.deleteThoughtsByUserId = exports.deleteThoughtById = exports.postThought = exports.getThoughtsByUserId = exports.getThoughtById = exports.getThoughts = void 0;
const thoughtsModel_1 = require("../models/thoughtsModel");
const mongodb_1 = require("mongodb");
const getThoughts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const mongoDb = req.app.get("mongoDb");
    const currentThoughts = yield (0, thoughtsModel_1.fetchThoughts)(mongoDb);
    res.status(200).send({ thoughts: currentThoughts });
});
exports.getThoughts = getThoughts;
const getThoughtById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoDb = req.app.get("mongoDb");
        const id = req.params.thought_id;
        const requestedThought = yield (0, thoughtsModel_1.fetchThoughtById)(mongoDb, id);
        res.status(200).send({ thought: requestedThought });
    }
    catch (error) {
        next(error);
    }
});
exports.getThoughtById = getThoughtById;
const getThoughtsByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.user_id;
        const mongoDb = req.app.get("mongoDb");
        const requestedThoughts = yield (0, thoughtsModel_1.fetchThoughtsByUserId)(mongoDb, id);
        res.status(200).send({ thoughts: requestedThoughts });
    }
    catch (error) {
        next(error);
    }
});
exports.getThoughtsByUserId = getThoughtsByUserId;
const postThought = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUserId = req.body.userId;
        /* if no userId provided on request body, then don't add that property to the request body
             - this will fail the validation set up on the mongoDb schema for the test database
        */
        if (currentUserId) {
            const currentUserIdClassConversion = new mongodb_1.ObjectId(currentUserId);
            req.body.userId = currentUserIdClassConversion;
        }
        const mongoDb = req.app.get("mongoDb");
        const newThought = yield (0, thoughtsModel_1.createThought)(mongoDb, req.body);
        res.status(201).send({ thought: newThought });
    }
    catch (error) {
        next(error);
    }
});
exports.postThought = postThought;
const deleteThoughtById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thoughtId = req.params.thought_id;
        const mongoDb = req.app.get("mongoDb");
        yield (0, thoughtsModel_1.removeThoughtById)(mongoDb, thoughtId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteThoughtById = deleteThoughtById;
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
const updateThoughtDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thoughtId = req.params.thought_id;
        const updateDatails = req.body;
        const mongoDb = req.app.get("mongoDb");
        const updatedThought = yield (0, thoughtsModel_1.amendThoughtDetails)(mongoDb, thoughtId, updateDatails);
        res.status(200).send({ thought: updatedThought });
    }
    catch (error) {
        next(error);
    }
});
exports.updateThoughtDetails = updateThoughtDetails;
