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
const createTestDb_1 = __importDefault(require("./createTestDb"));
const thoughts_1 = __importDefault(require("../database/test-data/thoughts"));
const users_1 = __importDefault(require("../database/test-data/users"));
function seedTestdatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const localDatabaseInfo = yield (0, createTestDb_1.default)();
        const localDatabase = localDatabaseInfo === null || localDatabaseInfo === void 0 ? void 0 : localDatabaseInfo.db;
        //delete all current test documents in collections
        yield (localDatabase === null || localDatabase === void 0 ? void 0 : localDatabase.collection("Users").deleteMany({}));
        yield (localDatabase === null || localDatabase === void 0 ? void 0 : localDatabase.collection("Thoughts").deleteMany({}));
        //insert test documents in collections
        yield (localDatabase === null || localDatabase === void 0 ? void 0 : localDatabase.collection("Users").insertMany(users_1.default));
        yield (localDatabase === null || localDatabase === void 0 ? void 0 : localDatabase.collection("Thoughts").insertMany(thoughts_1.default));
    });
}
exports.default = seedTestdatabase;
