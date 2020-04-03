"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var runOp_1 = require("./runOp");
var Security_1 = require("../Security");
exports.OperationStreamSymbol = Symbol();
var BasicOperationStream = /** @class */ (function () {
    function BasicOperationStream(chain, defaultContext) {
        if (chain === void 0) { chain = immutable_1.List(); }
        this.chain = chain;
        this.defaultContext = defaultContext;
        this.symbol = exports.OperationStreamSymbol;
    }
    BasicOperationStream.prototype.run = function (input, ctx) {
        var fullCtx = __assign(__assign({}, this.defaultContext), ctx);
        this.securityCheck(fullCtx);
        var first = this.chain.first();
        if (first) {
            return this.chain.reduce(function (reduction, op) {
                var nextReduction = runOp_1.runOp(op, fullCtx, reduction || input);
                if (!nextReduction) {
                    throw new Error("Operation Stream failed at " + (op.constructor.name || op.getOpName()));
                }
                return nextReduction;
            }, null);
        }
        throw new Error("Operation Stream must have at least one operation");
    };
    BasicOperationStream.prototype.securityCheck = function (ctx) {
        this.chain.forEach(function (op) {
            var c = op.security(ctx);
            if (!c)
                throw new Security_1.SecurityError("OperationStream: Security conditions failed in " + op.getOpName() + " " +
                    ("with additional context " + JSON.stringify(ctx)));
        });
    };
    BasicOperationStream.prototype.add = function (op) {
        return new BasicOperationStream(this.chain.push(op), this.defaultContext);
    };
    BasicOperationStream.prototype.join = function (otherStream) {
        var thisCtx = __assign({}, (this.defaultContext || {}));
        var otherCtx = __assign({}, (otherStream.defaultContext || {}));
        var fullCtx = __assign(__assign({}, thisCtx), otherCtx);
        return new BasicOperationStream(this.chain.concat(otherStream.chain), fullCtx);
    };
    BasicOperationStream.prototype.serialize = function () {
        var obj = { ctx: this.defaultContext, chain: this.chain.toJSON() };
        return JSON.stringify(obj);
    };
    return BasicOperationStream;
}());
exports.BasicOperationStream = BasicOperationStream;
function buildOpStream(op, defaultContext) {
    if (!defaultContext)
        return new BasicOperationStream(immutable_1.List([op]));
    return new BasicOperationStream(immutable_1.List([op]), defaultContext);
}
exports.buildOpStream = buildOpStream;
