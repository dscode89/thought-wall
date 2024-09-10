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
exports.fetchUsers = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const fetchUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    // get the Users collection from chosen database
    const usersCollection = connection_1.default.database.collection("Users");
    // this will return a cluster object so use toArray() to give you an array of users
    const currentUsers = yield usersCollection.find().toArray();
    return currentUsers;
});
exports.fetchUsers = fetchUsers;
