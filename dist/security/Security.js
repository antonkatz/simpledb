"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SecurityError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.SecurityError = SecurityError;
