"use strict";
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
function createDatabaseConnection() {
    client.connect();
    const db = client.db(process.env.DATABASE_NAME);
    return db;
}
let database = createDatabaseConnection();
exports.default = {
    database,
    client,
};
