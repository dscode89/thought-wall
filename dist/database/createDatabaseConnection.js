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
exports.default = createDatabaseConnection;
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function createDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbConnectionString = process.env.NODE_ENV
            ? process.env.CONNECTION_STRING_TEST
            : process.env.CONNECTION_STRING;
        const client = yield mongodb_1.MongoClient.connect(dbConnectionString);
        const dbName = process.env.NODE_ENV
            ? process.env.DATABASE_NAME_TEST
            : process.env.DATABASE_NAME;
        const db = client.db(dbName);
        //if are connecting to the dev database
        if (dbName === process.env.DATABASE_NAME) {
            const currentCollections = yield db.listCollections().toArray();
            const usersCollection = currentCollections.find((collection) => collection.name === "Users");
            const thoughtsCollection = currentCollections.find((collection) => collection.name === "Thoughts");
            if (!usersCollection) {
                yield db.createCollection("Users", {
                    validator: {
                        $jsonSchema: {
                            title: "User Document Validation",
                            required: [
                                "_id",
                                "firstName",
                                "lastName",
                                "preferredName",
                                "role",
                                "userPassword",
                                "email",
                            ],
                            additionalProperties: false,
                            properties: {
                                _id: {
                                    bsonType: "objectId",
                                    description: "This is the generated ObjectId instance for a new inserted user document",
                                },
                                firstName: {
                                    bsonType: "string",
                                    description: "'firstName' must be a string and is required",
                                },
                                lastName: {
                                    bsonType: "string",
                                    description: "'lastName' must be a string and is required",
                                },
                                preferredName: {
                                    bsonType: "string",
                                    description: "'preferredName' must be a string and is required",
                                },
                                role: {
                                    bsonType: "string",
                                    description: "'firstName' must be a string of ADMIN or USER",
                                },
                                userPassword: {
                                    bsonType: "string",
                                    description: "'userPassword' must be a string and is required",
                                },
                                email: {
                                    bsonType: "string",
                                    description: "'email' must be a string and is required",
                                },
                            },
                        },
                    },
                });
            }
            if (!thoughtsCollection) {
                yield db.createCollection("Thoughts", {
                    validator: {
                        $jsonSchema: {
                            title: "Thought Document Validation",
                            required: [
                                "_id",
                                "userId",
                                "thoughtMessage",
                                "category",
                                "isPriority",
                            ],
                            additionalProperties: false,
                            properties: {
                                _id: {
                                    bsonType: "objectId",
                                    description: "This is the generated ObjectId instance for a new inserted thought document",
                                },
                                userId: {
                                    bsonType: "objectId",
                                    description: "this is the objectId for the user who posted this thought",
                                },
                                thoughtMessage: {
                                    bsonType: "string",
                                    description: "thoughtMessage must be a string and is required",
                                },
                                category: {
                                    bsonType: "string",
                                    description: "'category' must be a string and of of the following values: BILLS | HOME | GENERAL",
                                },
                                isPriority: {
                                    bsonType: "bool",
                                    description: "'isPriority' must be a boolean and is required",
                                },
                            },
                        },
                    },
                });
            }
        }
        return { db, client };
    });
}
