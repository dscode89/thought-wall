"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // load environment variables
function createDatabaseConnection() {
    const connectionString = process.env.CONNECTION_STRING;
    const client = new mongodb_1.MongoClient(connectionString, {
        serverApi: {
            version: mongodb_1.ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });
    client.connect();
    const db = client.db("thought-wall");
    return db;
}
let database = createDatabaseConnection();
exports.default = database;
