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
exports.getThoughts = void 0;
const thoughtsModel_1 = require("../models/thoughtsModel");
const getThoughts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const mongoDb = req.app.get("mongoDb");
    const currentThoughts = yield (0, thoughtsModel_1.fetchThoughts)(mongoDb);
    res.status(200).send({ thoughts: currentThoughts });
});
exports.getThoughts = getThoughts;
