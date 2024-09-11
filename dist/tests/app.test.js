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
const seedTestDb_1 = __importDefault(require("../database/seedTestDb"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const createTestDb_1 = __importDefault(require("../database/createTestDb"));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, seedTestDb_1.default)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const localDatabaseInfo = yield (0, createTestDb_1.default)();
    yield localDatabaseInfo.client.close();
}));
describe("/api/users", () => {
    test("GET: 200 - will return object containing an list of users", () => {
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
});
