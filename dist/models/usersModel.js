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
exports.removeUser = exports.createUser = exports.fetchUsers = void 0;
const mongodb_1 = require("mongodb");
const fetchUsers = (db) => __awaiter(void 0, void 0, void 0, function* () {
    // get the Users collection from chosen database
    const usersCollection = db.collection("Users");
    // this will return a cluster object so use toArray() to give you an array of users
    const currentUsers = yield usersCollection.find().toArray();
    return currentUsers;
});
exports.fetchUsers = fetchUsers;
const createUser = (db, user) => __awaiter(void 0, void 0, void 0, function* () {
    // get the Users collection from chosen database
    const usersCollection = db.collection("Users");
    // this will return a cluster object so use toArray() to give you an array of users
    const { insertedId } = yield usersCollection.insertOne(user);
    const newUser = yield usersCollection.findOne({ _id: insertedId });
    return newUser;
});
exports.createUser = createUser;
const removeUser = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    const usersCollection = db.collection("Users");
    yield usersCollection.deleteOne({
        _id: new mongodb_1.ObjectId(id),
    });
});
exports.removeUser = removeUser;
