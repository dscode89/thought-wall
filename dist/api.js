"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    endpoints: {
        GET: {
            "/api/users": {
                statusCode: 200,
                returns: "This endpoint will return an array of user objects. Should the Users collection contain no documents, then an empty array will be returned.",
                dataStructure: [
                    {
                        _id: "string",
                        firstName: "string",
                        lastName: "string",
                        preferredName: "string",
                        role: "'ADMIN' | 'USER'",
                        userPassword: "string",
                        email: "string",
                    },
                ],
                queries: "There are no queries currently available for this endpoint.",
            },
            "/api/thoughts": {
                statusCode: 200,
                returns: "This endpoint will return an array of thoughts. Should the Thoughts collection contain no documents, then an empty array will be returned.",
                dataStructure: [
                    {
                        _id: "string",
                        userId: "string",
                        thoughtMessage: "string",
                        isPriority: "boolean",
                        category: "'BILLS' | 'HOME' | 'GENERAL'",
                    },
                ],
                queries: "There are no queries currently available for this endpoint.",
            },
            "/api/users/:user_id": {
                statusCode: 200,
                returns: "Will return an object representing the requested user.",
                dataStructure: {
                    _id: "string",
                    firstName: "string",
                    lastName: "string",
                    preferredName: "string",
                    role: "'ADMIN' | 'USER'",
                    userPassword: "string",
                    email: "string",
                },
                queries: "There are no queries currently available for this endpoint.",
                requirements: {
                    ":user_id": "Must be a 24 char hex string.",
                },
            },
            "/api/thoughts/:thought_id": {
                statusCode: 200,
                returns: "Will return an object representing the requested thought.",
                dataStructure: {
                    _id: "string",
                    userId: "string",
                    thoughtMessage: "string",
                    isPriority: "boolean",
                    category: "'BILLS' | 'HOME' | 'GENERAL'",
                },
                queries: "There are no queries currently available for this endpoint.",
                requirements: {
                    ":thought_id": "Must be a 24 char hex string.",
                },
            },
            "/api/thoughts/users/:user_id": {
                statusCode: 200,
                returns: "Will return an array of objects representing the requested thoughts for a specified user. Should the Thoughts collection contain no related documents, then an empty array will be returned unless the user id is invalid(an error will be thrown if this is the case).",
                dataStructure: [
                    {
                        _id: "string",
                        userId: "string",
                        thoughtMessage: "string",
                        isPriority: "boolean",
                        category: "'BILLS' | 'HOME' | 'GENERAL'",
                    },
                ],
                queries: "There are no queries currently available for this endpoint.",
                requirements: {
                    ":user_id": "Must be a 24 char hex string.",
                },
                possibleErrors: [404, 400],
            },
        },
        POST: {
            endpoints: {
                "/api/users": {
                    statusCode: 201,
                    returns: "This will return the new posted user object",
                    dataStructure: {
                        _id: "string",
                        firstName: "string",
                        lastName: "string",
                        preferredName: "string",
                        role: "'ADMIN' | 'USER'",
                        userPassword: "string",
                        email: "string",
                    },
                    queries: "There are no queries currently available for this endpoint.",
                    requirements: {
                        requestBody: {
                            firstName: "Min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes",
                            lastName: "Min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes",
                            preferredName: "Min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes",
                            role: "This can be a string of one of the following two values. 'ADMIN'| 'USER'",
                            userPassword: "Must be at least 8 chars in length and contain: at least one lower case, one uppercase, one number, one of the following special chars (!@£$%^&*()))",
                            email: "Must be a valid email structure - 'test@test.com'",
                        },
                    },
                    possibleErrors: [400],
                },
                "/api/thoughts": {
                    statusCode: 201,
                    returns: "This will return the new posted user object",
                    dataStructure: {
                        _id: "string",
                        userId: "string",
                        thoughtMessage: "string",
                        isPriority: "boolean",
                        category: "'BILLS' | 'HOME' | 'GENERAL'",
                    },
                    queries: "There are no queries currently available for this endpoint.",
                    requirements: {
                        requestBody: {
                            userID: "Must be a valid and existing 24 char hex string.",
                            thoughtMessage: "Must be at least 10 chars and contain a lowercase or uppercase letter.",
                            isPriority: "This must be a boolean.",
                            category: "This can be a string of one of the following three values. 'BILLS' | 'HOME' | 'GENERAL'.",
                        },
                    },
                    possibleErrors: [400],
                },
            },
        },
        DELETE: {
            endpoints: {
                "/api/users/:user_id": {
                    statusCode: 204,
                    returns: "The is no repsonse body for this request. It will delete a requested user.",
                    queries: "There are no queries currently available for this endpoint.",
                    requirements: {
                        ":user_id": "Must be a 24 char hex string.",
                    },
                    possibleErrors: [404, 400],
                },
                "/api/thoughts/:thought_id": {
                    statusCode: 204,
                    returns: "The is no repsonse body for this request.",
                    queries: "There are no queries currently available for this endpoint.",
                    requirements: {
                        ":thought_id": "Must be a 24 char hex string.",
                    },
                    possibleErrors: [404, 400],
                },
                "/api/thoughts/users/:user_id": {
                    statusCode: 204,
                    returns: "The is no repsonse body for this request.",
                    queries: "There are no queries currently available for this endpoint.",
                    requirements: {
                        ":user_id": "Must be a 24 char hex string.",
                    },
                    possibleErrors: [404, 400],
                },
            },
        },
        PATCH: {
            endpoints: {
                "/api/users/:user_id": {
                    statusCode: 200,
                    returns: "This endpoint will return an updated user object",
                    dataStructure: {
                        _id: "string",
                        firstName: "string",
                        lastName: "string",
                        preferredName: "string",
                        role: "'ADMIN' | 'USER'",
                        userPassword: "string",
                        email: "string",
                    },
                    queries: "There are no queries currently available for this endpoint.",
                    requirements: {
                        firstName: "Min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes",
                        lastName: "Min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes",
                        preferredName: "Min 1 char, max 12 chars, no numbers or special chars. Can contain spaces and apostrophes",
                        role: "This can be a string of one of the following two values. 'ADMIN'| 'USER'",
                        userPassword: "Must be at least 8 chars in length and contain: at least one lower case, one uppercase, one number, one of the following special chars (!@£$%^&*()))",
                        email: "Must be a valid email structure - 'test@test.com'",
                    },
                    possibleErrors: [404, 400],
                },
                "/api/thoughts/:thought_id": {
                    statusCode: 200,
                    returns: "This endpoint will return an updated thought object",
                    dataStructure: {
                        _id: "string",
                        userId: "string",
                        thoughtMessage: "string",
                        isPriority: "boolean",
                        category: "'BILLS' | 'HOME' | 'GENERAL'",
                    },
                    queries: "There are no queries currently available for this endpoint.",
                    requirements: {
                        thoughtMessage: "Must be at least 10 chars and contain a lowercase or uppercase letter.",
                        isPriority: "This must be a boolean.",
                        category: "This can be a string of one of the following three values. 'BILLS' | 'HOME' | 'GENERAL'.",
                    },
                    possibleErrors: [404, 400],
                },
            },
        },
    },
};
