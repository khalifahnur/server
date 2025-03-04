"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { webcrypto } = require('crypto');
const GenerateSecretKey = () => {
    const array = new Uint8Array(32);
    webcrypto.getRandomValues(array);
    return Buffer.from(array).toString("hex");
};
exports.default = GenerateSecretKey;
