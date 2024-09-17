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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.amendUserDetails = exports.removeUser = exports.createUser = exports.fetchUserByUserId = exports.fetchUsers = void 0;
const mongodb_1 = require("mongodb");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fetchUsers = (db) => __awaiter(void 0, void 0, void 0, function* () {
    // get the Users collection from chosen database
    const usersCollection = db.collection("Users");
    // this will return a cluster object so use toArray() to give you an array of users
    const currentUsers = yield usersCollection.find().toArray();
    return currentUsers;
});
exports.fetchUsers = fetchUsers;
const fetchUserByUserId = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    const usersCollection = db.collection("Users");
    const requestedUser = yield usersCollection.findOne({
        _id: new mongodb_1.ObjectId(id),
    });
    if (requestedUser === null) {
        return Promise.reject({ status: 404, errorMsg: "404 - invalid user id" });
    }
    return requestedUser;
});
exports.fetchUserByUserId = fetchUserByUserId;
const createUser = (db, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userRoleWhiteList = ["ADMIN", "USER"];
    if (!userRoleWhiteList.includes(user.role)) {
        return Promise.reject({
            status: 400,
            errorMsg: "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
        });
    }
    // get the Users collection from chosen database
    const usersCollection = db.collection("Users");
    // this will return a cluster object so use toArray() to give you an array of users
    const salt = bcryptjs_1.default.genSaltSync(10);
    const hash = bcryptjs_1.default.hashSync(user.userPassword, salt);
    const { insertedId } = yield usersCollection.insertOne(Object.assign(Object.assign({}, user), { userPassword: hash }));
    const newUser = yield usersCollection.findOne({ _id: insertedId });
    return newUser;
});
exports.createUser = createUser;
const removeUser = (db, id) => __awaiter(void 0, void 0, void 0, function* () {
    const usersCollection = db.collection("Users");
    const { deletedCount } = yield usersCollection.deleteOne({
        _id: new mongodb_1.ObjectId(id),
    });
    if (!deletedCount) {
        return Promise.reject({ status: 404, errorMsg: "404 - invalid user id" });
    }
});
exports.removeUser = removeUser;
const amendUserDetails = (db, id, updateDetails) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.keys(updateDetails).length) {
        return Promise.reject({
            status: 400,
            errorMsg: "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
        });
    }
    if (updateDetails._id) {
        return Promise.reject({
            status: 400,
            errorMsg: "400 - cannot change this property",
        });
    }
    if (updateDetails.role) {
        const userRoleWhiteList = ["ADMIN", "USER"];
        if (!userRoleWhiteList.includes(updateDetails.role)) {
            return Promise.reject({
                status: 400,
                errorMsg: "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
            });
        }
    }
    if (updateDetails.userPassword) {
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync(updateDetails.userPassword, salt);
        updateDetails.userPassword = hash;
    }
    const usersCollection = db.collection("Users");
    const updatedUser = yield usersCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: Object.assign({}, updateDetails) }, { returnDocument: "after" });
    if (updatedUser === null) {
        return Promise.reject({ status: 404, errorMsg: "404 - invalid user id" });
    }
    return updatedUser;
});
exports.amendUserDetails = amendUserDetails;
