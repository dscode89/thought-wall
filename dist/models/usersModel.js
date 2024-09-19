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
    const validFirstName = /^(?=.*[a-zA-Z])[a-zA-Z\s']{1,12}$/.test(user.firstName);
    const validLastName = /^(?=.*[a-zA-Z])[a-zA-Z\s']{1,12}$/.test(user.lastName);
    const validPreferredName = /^(?=.*[a-zA-Z])[a-zA-Z\s']{1,12}$/.test(user.preferredName);
    const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@£$%^&\*()])[A-Za-z\d!@£$%^&\*()]{8,}$/.test(user.userPassword);
    const validEmail = /^[a-zA-Z0-9_\.±]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(user.email);
    const validRole = /^(ADMIN|USER)$/.test(user.role);
    if (!validFirstName ||
        !validLastName ||
        !validPreferredName ||
        !validPassword ||
        !validEmail ||
        !validRole) {
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
            errorMsg: "400 - this property can not be changed",
        });
    }
    let validFirstName = true;
    let validLastName = true;
    let validPreferredName = true;
    let validPassword = true;
    let validEmail = true;
    let validRole = true;
    if (updateDetails.firstName || updateDetails.firstName === "") {
        validFirstName = /^(?=.*[a-zA-Z])[a-zA-Z\s']{1,12}$/.test(updateDetails.firstName);
    }
    if (updateDetails.lastName || updateDetails.lastName === "") {
        validLastName = /^(?=.*[a-zA-Z])[a-zA-Z\s']{1,12}$/.test(updateDetails.lastName);
    }
    if (updateDetails.preferredName || updateDetails.preferredName === "") {
        validPreferredName = /^(?=.*[a-zA-Z])[a-zA-Z\s']{1,12}$/.test(updateDetails.preferredName);
    }
    if (updateDetails.role || updateDetails.role === "") {
        validRole = /^(ADMIN|USER)$/.test(updateDetails.role);
    }
    if (updateDetails.userPassword || updateDetails.userPassword === "") {
        validPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@£$%^&\*()])[A-Za-z\d!@£$%^&\*()]{8,}$/.test(updateDetails.userPassword);
    }
    if (updateDetails.email || updateDetails.email === "") {
        validEmail = /^[a-zA-Z0-9_\.±]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(updateDetails.email);
    }
    if (!validFirstName ||
        !validLastName ||
        !validPreferredName ||
        !validRole ||
        !validPassword ||
        !validEmail) {
        return Promise.reject({
            status: 400,
            errorMsg: "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
        });
    }
    if (Object.keys(updateDetails).includes("userPassword")) {
        if (!validPassword) {
            return Promise.reject({
                status: 400,
                errorMsg: "400 - failed validation: please refer to api documentation for correct structure of request body for your endpoint",
            });
        }
        else {
            const salt = bcryptjs_1.default.genSaltSync(10);
            const hash = bcryptjs_1.default.hashSync(updateDetails.userPassword, salt);
            updateDetails.userPassword = hash;
        }
    }
    const usersCollection = db.collection("Users");
    const updatedUser = yield usersCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: Object.assign({}, updateDetails) }, { returnDocument: "after" });
    if (updatedUser === null) {
        return Promise.reject({
            status: 404,
            errorMsg: "404 - userId could not be found",
        });
    }
    return updatedUser;
});
exports.amendUserDetails = amendUserDetails;
