"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createTestDb_1 = __importDefault(require("../database/createTestDb"));
const createDevDb_1 = __importDefault(require("../database/createDevDb"));
const currentDb = process.env.NODE_ENV ? createTestDb_1.default : createDevDb_1.default;
exports.default = currentDb;
