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
const seedDatabase_1 = __importDefault(require("../database/seedDatabase"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const createDatabaseConnection_1 = __importDefault(require("../database/createDatabaseConnection"));
const usersModel_1 = require("../models/usersModel");
const thoughtsModel_1 = require("../models/thoughtsModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let testDb;
let testDbClient;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const { db, client } = yield (0, createDatabaseConnection_1.default)();
    testDb = db;
    testDbClient = client;
    app_1.default.set("mongoDb", testDb);
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, seedDatabase_1.default)(testDb);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDbClient.close();
}));
describe("/api/users", () => {
    describe("GET", () => {
        test("GET: 200 - will return object containing a list of users", () => {
            return (0, supertest_1.default)(app_1.default)
                .get("/api/users")
                .expect(200)
                .then(({ body }) => {
                const users = body.users;
                expect(users.length).toBe(5);
                users.forEach((user) => {
                    expect(user).toEqual(expect.objectContaining({
                        _id: expect.any(String),
                        firstName: expect.any(String),
                        lastName: expect.any(String),
                        preferredName: expect.any(String),
                        role: expect.any(String),
                        userPassword: expect.any(String),
                    }));
                });
            });
        });
    });
    describe("POST", () => {
        test("POST: 201 - will return a new posted user document", () => {
            const salt = bcryptjs_1.default.genSaltSync(10);
            const hash = bcryptjs_1.default.hashSync("securepass458", salt);
            return (0, supertest_1.default)(app_1.default)
                .post("/api/users")
                .expect(201)
                .send({
                firstName: "Ashlyn",
                lastName: "Lovatt",
                preferredName: "Ash",
                role: "ADMIN",
                userPassword: "securepass458",
                email: "no@cheese.com",
            })
                .then(({ body }) => {
                const user = body.user;
                expect(bcryptjs_1.default.compareSync("securepass458", user.userPassword)).toBeTruthy();
                expect(user).toMatchObject({
                    firstName: "Ashlyn",
                    lastName: "Lovatt",
                    preferredName: "Ash",
                    role: "ADMIN",
                    email: "no@cheese.com",
                });
                return (0, usersModel_1.fetchUsers)(testDb);
            })
                .then((users) => {
                expect(users.length).toBe(6);
            });
        });
    });
    // error handling needed for post request
});
describe("/api/users/:user_id", () => {
    describe("DELETE", () => {
        test("DELETE:204 - will delete a user document from Users collection by the userID", () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield (0, usersModel_1.fetchUsers)(testDb);
            const testUserId = users[0]["_id"];
            return (0, supertest_1.default)(app_1.default)
                .delete("/api/users/" + testUserId)
                .expect(204)
                .then(() => {
                return (0, usersModel_1.fetchUsers)(testDb);
            })
                .then((users) => {
                expect(users.length).toBe(4);
            });
        }));
    });
    describe("PATCH", () => {
        test("PATCH: 200 - will return a user document with an updated firstName property", () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield (0, usersModel_1.fetchUsers)(testDb);
            const testUserId = users[0]["_id"].toHexString();
            expect(users[0].firstName).toBe("John");
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/users/" + testUserId)
                .expect(200)
                .send({
                firstName: "Dave",
            })
                .then(({ body }) => {
                const updatedUser = body.user;
                expect(testUserId).toBe(updatedUser._id);
                expect(updatedUser.firstName).toBe("Dave");
            });
        }));
        test("PATCH: 200 - will return a user document with an updated lastName property", () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield (0, usersModel_1.fetchUsers)(testDb);
            const testUserId = users[0]["_id"].toHexString();
            expect(users[0].lastName).toBe("Doe");
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/users/" + testUserId)
                .expect(200)
                .send({
                lastName: "Moran",
            })
                .then(({ body }) => {
                const updatedUser = body.user;
                expect(testUserId).toBe(updatedUser._id);
                expect(updatedUser.lastName).toBe("Moran");
            });
        }));
        test("PATCH: 200 - will return a user document with an updated preferredNAme property", () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield (0, usersModel_1.fetchUsers)(testDb);
            const testUserId = users[0]["_id"].toHexString();
            expect(users[0].preferredName).toBe("Johnny");
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/users/" + testUserId)
                .expect(200)
                .send({
                preferredName: "John Boy",
            })
                .then(({ body }) => {
                const updatedUser = body.user;
                expect(testUserId).toBe(updatedUser._id);
                expect(updatedUser.preferredName).toBe("John Boy");
            });
        }));
        test("PATCH: 200 - will return a user document with an updated role property", () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield (0, usersModel_1.fetchUsers)(testDb);
            const testUserId = users[0]["_id"].toHexString();
            expect(users[0].role).toBe("ADMIN");
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/users/" + testUserId)
                .expect(200)
                .send({
                role: "USER",
            })
                .then(({ body }) => {
                const updatedUser = body.user;
                expect(testUserId).toBe(updatedUser._id);
                expect(updatedUser.role).toBe("USER");
            });
        }));
        test("PATCH: 200 - will return a user document with an updated userPassword property", () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield (0, usersModel_1.fetchUsers)(testDb);
            const testUserId = users[0]["_id"].toHexString();
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/users/" + testUserId)
                .expect(200)
                .send({
                userPassword: "newPassword123",
            })
                .then(({ body }) => {
                const updatedUser = body.user;
                expect(users[0].userPassword).not.toBe(updatedUser.password);
            });
        }));
        test("PATCH: 200 - will return a user document with an updated email property", () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield (0, usersModel_1.fetchUsers)(testDb);
            const testUserId = users[0]["_id"].toHexString();
            expect(users[0].email).toBe("ham@cheese.com");
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/users/" + testUserId)
                .expect(200)
                .send({
                email: "spam@cheese.com",
            })
                .then(({ body }) => {
                const updatedUser = body.user;
                expect(testUserId).toBe(updatedUser._id);
                expect(updatedUser.email).toBe("spam@cheese.com");
            });
        }));
        test("PATCH: 200 - will return a user document with an multiple properties updated", () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield (0, usersModel_1.fetchUsers)(testDb);
            const testUserId = users[0]["_id"].toHexString();
            expect(users[0].email).toBe("ham@cheese.com");
            expect(users[0].role).toBe("ADMIN");
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/users/" + testUserId)
                .expect(200)
                .send({
                role: "USER",
                email: "spam@cheese.com",
            })
                .then(({ body }) => {
                const updatedUser = body.user;
                expect(testUserId).toBe(updatedUser._id);
                expect(updatedUser.email).toBe("spam@cheese.com");
                expect(updatedUser.role).toBe("USER");
            });
        }));
    });
    // error handling needed to be thought about
});
describe("/api/thoughts", () => {
    describe("GET", () => {
        test("GET: 200 - will return object containing an list of thoughts", () => {
            return (0, supertest_1.default)(app_1.default)
                .get("/api/thoughts")
                .expect(200)
                .then(({ body }) => {
                const thoughts = body.thoughts;
                expect(thoughts.length).toBe(6);
                thoughts.forEach((thought) => {
                    expect(thought).toEqual(expect.objectContaining({
                        _id: expect.any(String),
                        thoughtMessage: expect.any(String),
                        category: expect.any(String),
                        isPriority: expect.any(Boolean),
                    }));
                });
            });
        });
    });
    describe("POST", () => {
        test("POST: 201 - will return a new posted thought document", () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield (0, usersModel_1.fetchUsers)(testDb);
            const testUserId = users[0]["_id"];
            return (0, supertest_1.default)(app_1.default)
                .post("/api/thoughts")
                .expect(201)
                .send({
                _userId: testUserId.toHexString(),
                category: "BILLS",
                isPriority: false,
                thoughtMessage: "I need to pay my billy bills",
            })
                .then(({ body }) => {
                expect(body.thought).toMatchObject({
                    _userId: testUserId.toHexString(),
                    category: "BILLS",
                    isPriority: false,
                    thoughtMessage: "I need to pay my billy bills",
                });
                return (0, thoughtsModel_1.fetchThoughts)(testDb);
            })
                .then((thoughts) => {
                thoughts[6], "<-- in database";
                expect(thoughts.length).toBe(7);
            });
        }));
        // error handling needed for post request
    });
});
describe("/api/thoughts/:thought_id", () => {
    describe("PATCH", () => {
        test("PATCH: 200 - will return updated thought with amended thoughtMessage", () => __awaiter(void 0, void 0, void 0, function* () {
            const thoughts = yield (0, thoughtsModel_1.fetchThoughts)(testDb);
            const testThoughtId = thoughts[0]["_id"].toHexString();
            expect(thoughts[0].thoughtMessage).toBe("Need to fix the leaking sink in the kitchen.");
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/thoughts/" + testThoughtId)
                .expect(200)
                .send({
                thoughtMessage: "I have updated this thought msg!",
            })
                .then(({ body }) => {
                const updatedThought = body.thought;
                expect(testThoughtId).toBe(updatedThought._id);
                expect(updatedThought.thoughtMessage).toBe("I have updated this thought msg!");
            });
        }));
        test("PATCH: 200 - will return updated thought with isPriority property amended", () => __awaiter(void 0, void 0, void 0, function* () {
            const thoughts = yield (0, thoughtsModel_1.fetchThoughts)(testDb);
            const testThoughtId = thoughts[0]["_id"].toHexString();
            expect(thoughts[0].isPriority).toBe(true);
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/thoughts/" + testThoughtId)
                .expect(200)
                .send({
                isPriority: false,
            })
                .then(({ body }) => {
                const updatedThought = body.thought;
                expect(testThoughtId).toBe(updatedThought._id);
                expect(updatedThought.isPriority).toBe(false);
            });
        }));
        test("PATCH: 200 - will return updated thought with category amended", () => __awaiter(void 0, void 0, void 0, function* () {
            const thoughts = yield (0, thoughtsModel_1.fetchThoughts)(testDb);
            const testThoughtId = thoughts[0]["_id"].toHexString();
            expect(thoughts[0].category).toBe("HOME");
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/thoughts/" + testThoughtId)
                .expect(200)
                .send({
                category: "GENERAL",
            })
                .then(({ body }) => {
                const updatedThought = body.thought;
                expect(testThoughtId).toBe(updatedThought._id);
                expect(updatedThought.category).toBe("GENERAL");
            });
        }));
        test("PATCH: 200 - will return updated thought document that has had multiple valid properties amended", () => __awaiter(void 0, void 0, void 0, function* () {
            const thoughts = yield (0, thoughtsModel_1.fetchThoughts)(testDb);
            const testThoughtId = thoughts[0]["_id"].toHexString();
            expect(thoughts[0].category).toBe("HOME");
            expect(thoughts[0].isPriority).toBe(true);
            return (0, supertest_1.default)(app_1.default)
                .patch("/api/thoughts/" + testThoughtId)
                .expect(200)
                .send({
                category: "GENERAL",
                isPriority: false,
            })
                .then(({ body }) => {
                const updatedThought = body.thought;
                expect(testThoughtId).toBe(updatedThought._id);
                expect(updatedThought.category).toBe("GENERAL");
                expect(updatedThought.isPriority).toBe(false);
            });
        }));
        // error handling needed here - think about possible errors
    });
    describe("DELETE", () => {
        test("DELETE: 204 - will delete a thought document from Thoughts collection", () => __awaiter(void 0, void 0, void 0, function* () {
            const thoughts = yield (0, thoughtsModel_1.fetchThoughts)(testDb);
            const testThoughtId = thoughts[0]["_id"];
            return (0, supertest_1.default)(app_1.default)
                .delete("/api/thoughts/" + testThoughtId)
                .expect(204)
                .then(() => {
                return (0, thoughtsModel_1.fetchThoughts)(testDb);
            })
                .then((users) => {
                expect(users.length).toBe(5);
            });
        }));
        // error handling needed to be thought about
    });
});
describe("/api/thoughts/users/:user_id", () => {
    describe("DELETE", () => {
        test("DELETE: 204 - will delete all thought documents by a specific user from Thoughts collection", () => __awaiter(void 0, void 0, void 0, function* () {
            const thoughts = yield (0, usersModel_1.fetchUsers)(testDb);
            const testUserId = thoughts[0]["_id"];
            return (0, supertest_1.default)(app_1.default)
                .delete("/api/thoughts/users/" + testUserId)
                .expect(204)
                .then(() => {
                return (0, thoughtsModel_1.fetchThoughts)(testDb);
            })
                .then((users) => {
                expect(users.length).toBe(3);
            });
        }));
    });
});
