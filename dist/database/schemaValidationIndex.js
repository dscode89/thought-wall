"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thoughtValidationSchema = exports.userValidationSchema = void 0;
const userValidationSchema = {
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
                minLength: 1,
            },
            lastName: {
                bsonType: "string",
                description: "'lastName' must be a string and is required",
                minLength: 1,
            },
            preferredName: {
                bsonType: "string",
                description: "'preferredName' must be a string and is required",
                minLength: 1,
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
};
exports.userValidationSchema = userValidationSchema;
const thoughtValidationSchema = {
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
};
exports.thoughtValidationSchema = thoughtValidationSchema;
