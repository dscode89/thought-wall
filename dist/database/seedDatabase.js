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
const schemaValidationIndex_1 = require("./schemaValidationIndex");
function seedTestDatabase(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.collection("Users").drop();
        yield db.collection("Thoughts").drop();
        yield db.createCollection("Users", {
            validator: schemaValidationIndex_1.userValidationSchema,
        });
        yield db.createCollection("Thoughts", {
            // why does this ignore the _user validation if it is not provided?
            validator: schemaValidationIndex_1.thoughtValidationSchema,
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
