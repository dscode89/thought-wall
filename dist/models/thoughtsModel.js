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
exports.amendThoughtDetails = exports.removeThoughtsByUserId = exports.removeThoughtById = exports.createThought = exports.fetchThoughtsByUserId = exports.fetchThoughtById = exports.fetchThoughts = void 0;
const mongodb_1 = require("mongodb");
const fetchThoughts = (db) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtsCollection = db.collection("Thoughts");
    const currentThoughts = yield thoughtsCollection.find().toArray();
    return currentThoughts;
});
exports.fetchThoughts = fetchThoughts;
const fetchThoughtById = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtsCollection = db.collection("Thoughts");
    const requestedThought = yield thoughtsCollection.findOne({
        _id: new mongodb_1.ObjectId(id),
    });
    if (requestedThought === null) {
        return Promise.reject({
            status: 404,
            errorMsg: "404 - invalid thought id",
        });
    }
    return requestedThought;
});
exports.fetchThoughtById = fetchThoughtById;
const fetchThoughtsByUserId = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtsCollection = db.collection("Thoughts");
    const requestedThoughts = yield thoughtsCollection
        .find({ userId: new mongodb_1.ObjectId(id) })
        .toArray();
    if (!requestedThoughts.length) {
        return Promise.reject({
            status: 404,
            errorMsg: "404 - invalid thought id",
        });
    }
    return requestedThoughts;
});
exports.fetchThoughtsByUserId = fetchThoughtsByUserId;
const createThought = (db, thought) => __awaiter(void 0, void 0, void 0, function* () {
    const validThoughtMessage = /(?=.*[a-zA-Z]).{10,}$/.test(thought.thoughtMessage);
    const validCategory = /^(BILLS|HOME|GENERAL)/.test(thought.category);
    if (!validThoughtMessage || !validCategory) {
        return Promise.reject({
            status: 400,
            errorMsg: "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
        });
    }
    const thoughtsCollection = db.collection("Thoughts");
    const { insertedId } = yield thoughtsCollection.insertOne(thought);
    const newThought = yield thoughtsCollection.findOne({ _id: insertedId });
    return newThought;
});
exports.createThought = createThought;
const removeThoughtById = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtsCollection = db.collection("Thoughts");
    const { deletedCount } = yield thoughtsCollection.deleteOne({
        _id: new mongodb_1.ObjectId(id),
    });
    if (!deletedCount) {
        return Promise.reject({
            status: 404,
            errorMsg: "404 - invalid thought id",
        });
    }
});
exports.removeThoughtById = removeThoughtById;
const removeThoughtsByUserId = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtsCollection = db.collection("Thoughts");
    const { deletedCount } = yield thoughtsCollection.deleteMany({
        userId: new mongodb_1.ObjectId(id),
    });
    if (!deletedCount) {
        return Promise.reject({
            status: 404,
            errorMsg: "404 - invalid user id",
        });
    }
});
exports.removeThoughtsByUserId = removeThoughtsByUserId;
const amendThoughtDetails = (db, id, updateDetails) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.keys(updateDetails).length) {
        return Promise.reject({
            status: 400,
            errorMsg: "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
        });
    }
    let validThoughtMessage = true;
    let validCategory = true;
    if (updateDetails.thoughtMessage) {
        validThoughtMessage = /(?=.*[a-zA-Z]).{10,}$/.test(updateDetails.thoughtMessage);
    }
    if (updateDetails.category) {
        validCategory = /^(BILLS|HOME|GENERAL)/.test(updateDetails.category);
    }
    if (!validThoughtMessage || !validCategory) {
        return Promise.reject({
            status: 400,
            errorMsg: "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
        });
    }
    if (updateDetails.userId || updateDetails._id) {
        return Promise.reject({
            status: 400,
            errorMsg: "400 - cannot change this property",
        });
    }
    const thoughtsCollection = db.collection("Thoughts");
    const updatedThought = yield thoughtsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: Object.assign({}, updateDetails) }, { returnDocument: "after" });
    if (updatedThought === null) {
        return Promise.reject({
            status: 404,
            errorMsg: "404 - thoughtId could not be found",
        });
    }
    return updatedThought;
});
exports.amendThoughtDetails = amendThoughtDetails;
