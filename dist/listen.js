"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const createDatabaseConnection_1 = __importDefault(require("./database/createDatabaseConnection"));
(0, createDatabaseConnection_1.default)()
    .then((mongoDb) => {
    const { db } = mongoDb;
    app_1.default.set("mongoDb", db);
})
    .then(() => {
    app_1.default.listen(9090, () => {
        console.log("listening on PORT 9090");
    });
});
