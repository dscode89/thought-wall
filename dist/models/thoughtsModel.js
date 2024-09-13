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
exports.amendThoughtDetails = exports.removeThoughtsByUserId = exports.removeThought = exports.createThought = exports.fetchThoughts = void 0;
const mongodb_1 = require("mongodb");
const fetchThoughts = (db) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtsCollection = db.collection("Thoughts");
    const currentThoughts = yield thoughtsCollection.find().toArray();
    return currentThoughts;
});
exports.fetchThoughts = fetchThoughts;
const createThought = (db, thought) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtsCollection = db.collection("Thoughts");
    const { insertedId } = yield thoughtsCollection.insertOne(thought);
    const newThought = yield thoughtsCollection.findOne({ _id: insertedId });
    return newThought;
});
exports.createThought = createThought;
const removeThought = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtsCollection = db.collection("Thoughts");
    yield thoughtsCollection.deleteOne({
        _id: new mongodb_1.ObjectId(id),
    });
});
exports.removeThought = removeThought;
const removeThoughtsByUserId = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtsCollection = db.collection("Thoughts");
    yield thoughtsCollection.deleteMany({
        _userId: new mongodb_1.ObjectId(id),
    });
});
exports.removeThoughtsByUserId = removeThoughtsByUserId;
const amendThoughtDetails = (db, id, updateDatails) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtsCollection = db.collection("Thoughts");
    const updatedThought = yield thoughtsCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: Object.assign({}, updateDatails) }, { returnDocument: "after" });
    return updatedThought;
});
exports.amendThoughtDetails = amendThoughtDetails;
