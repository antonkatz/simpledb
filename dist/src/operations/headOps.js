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
Object.defineProperty(exports, "__esModule", { value: true });
var Operation_1 = require("./Operation");
var rxjs_1 = require("rxjs");
var operationRegistry_1 = require("./operationRegistry");
var HeadOp = /** @class */ (function (_super) {
    __extends(HeadOp, _super);
    function HeadOp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "HeadOp";
        return _this;
    }
    // @ts-ignore
    HeadOp.prototype.security = function (ctx) {
        return true;
    };
    HeadOp.prototype.operation = function (ctx) {
        return rxjs_1.from([ctx.head]);
    };
    return HeadOp;
}(Operation_1.BasicOperation));
exports.HeadOp = HeadOp;
operationRegistry_1.registerOperation(HeadOp);
