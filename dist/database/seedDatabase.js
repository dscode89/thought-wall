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
const thoughts_1 = __importDefault(require("./test-data/thoughts"));
const users_1 = __importDefault(require("./test-data/users"));
function seedTestDatabase(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.collection("Users").drop();
        yield db.collection("Thoughts").drop();
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
        yield db.createCollection("Thoughts", {
            // why does this ignore the _user validation if it is not provided?
            validator: {
                $jsonSchema: {
                    title: "Thought Document Validation",
                    required: ["_id", "userId", "thoughtMessage", "category", "isPriority"],
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
        yield db.collection("Users").insertMany(users_1.default);
        const instertedUsers = yield db.collection("Users").find().toArray();
        const firstUserId = instertedUsers[0]["_id"];
        const secondUserId = instertedUsers[1]["_id"];
        thoughts_1.default.forEach((thought, i) => {
            if (i % 2 === 0) {
                thought.userId = firstUserId;
            }
            else {
                thought.userId = secondUserId;
            }
        });
        yield db.collection("Thoughts").insertMany(thoughts_1.default);
    });
}
exports.default = seedTestDatabase;
