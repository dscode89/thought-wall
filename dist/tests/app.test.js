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
    test("POST: 201 - will return a posted user document", () => {
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
            expect(user).toMatchObject({
                firstName: "Ashlyn",
                lastName: "Lovatt",
                preferredName: "Ash",
                role: "ADMIN",
                userPassword: "securepass458",
                email: "no@cheese.com",
            });
            return (0, usersModel_1.fetchUsers)(testDb);
        })
            .then((users) => {
            expect(users.length).toBe(6);
        });
    });
    test("DELETE:204 - will delete a user document from Users collection", () => __awaiter(void 0, void 0, void 0, function* () {
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
describe("/api/thoughts", () => {
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
    test("POST: 201 - will return a posted thought document", () => __awaiter(void 0, void 0, void 0, function* () {
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
});
