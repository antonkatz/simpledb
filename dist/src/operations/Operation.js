"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var OperationStream_1 = require("../execution/OperationStream");
var immutable_1 = require("immutable");
exports.OperationSymbol = Symbol();
var BasicOperation = /** @class */ (function () {
    function BasicOperation() {
        this.symbol = exports.OperationSymbol;
        this.context = {};
    }
    BasicOperation.prototype.getOpName = function () {
        return this.name;
    };
    BasicOperation.prototype.withContext = function (andContext) {
        var _s = this;
        return new /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.context = __assign(__assign({}, _s.context), andContext);
                _this.name = _s.getOpName();
                return _this;
            }
            class_1.prototype.operation = function (ctx, inObs) {
                var fullCtx = __assign(__assign({}, andContext), ctx);
                return _s.operation(fullCtx, inObs);
            };
            class_1.prototype.security = function (ctx) {
                var fullCtx = __assign(__assign({}, andContext), ctx);
                return _s.security(fullCtx);
            };
            return class_1;
        }(BasicOperation));
    };
    BasicOperation.prototype.chain = function (opOrStream) {
        if (opOrStream.symbol === exports.OperationSymbol) {
            var op = opOrStream;
            return new OperationStream_1.BasicOperationStream(immutable_1.List([this, op]));
        }
        else if (opOrStream.symbol === OperationStream_1.OperationStreamSymbol) {
            var stream = opOrStream;
            var thisStream = new OperationStream_1.BasicOperationStream(immutable_1.List([this]));
            return thisStream.join(stream);
        }
        throw new Error('An operation can only be chained with another or a stream');
    };
    BasicOperation.prototype.toJSON = function () {
        return { opName: this.getOpName(), ctx: this.context };
    };
    return BasicOperation;
}());
exports.BasicOperation = BasicOperation;
