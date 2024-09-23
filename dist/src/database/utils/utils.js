"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHexString = void 0;
const generateHexString = (length = 24) => {
    const hexChars = "0123456789ABCDEF";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += hexChars[Math.floor(Math.random() * hexChars.length)];
    }
    return result;
};
exports.generateHexString = generateHexString;
