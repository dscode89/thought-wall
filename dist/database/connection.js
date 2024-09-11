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
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
const ENV = process.env.NODE_ENV || "dev";
(0, dotenv_1.config)({ path: __dirname + `/../../.env.${ENV}` }); // load environment variables
const connectionString = process.env.CONNECTION_STRING;
// connect to either local mongoDb database or atlas cluster
const client = new mongodb_1.MongoClient(connectionString, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
// function to connect to the test of dev database
function createDatabaseCollections() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const db = client.db(process.env.DATABASE_NAME);
        // if not in test environment - just create the collections without documents
        if (ENV === "dev") {
            console.log("in here");
            yield db.createCollection("Users");
            yield db.createCollection("Thoughts");
        }
        return db;
    });
}
exports.default = {
    createDatabaseCollections,
    client,
};
