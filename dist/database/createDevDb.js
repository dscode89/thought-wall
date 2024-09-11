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
exports.default = createDevCollections;
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // read environment variables
function createDevCollections() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield mongodb_1.MongoClient.connect(process.env.CONNECTION_STRING, {
                serverApi: {
                    version: mongodb_1.ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                },
            });
            const db = client.db(process.env.DATABASE_NAME);
            yield db.createCollection("Users");
            yield db.createCollection("Thoughts");
            return { db, client };
        }
        catch (error) {
            console.error(error);
        }
    });
}
createDevCollections();
