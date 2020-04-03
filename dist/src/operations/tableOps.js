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
var operators_1 = require("rxjs/operators");
var operationRegistry_1 = require("./operationRegistry");
var TableGetOp = /** @class */ (function (_super) {
    __extends(TableGetOp, _super);
    function TableGetOp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "TableGetOp";
        return _this;
    }
    TableGetOp.prototype.security = function (ctx) {
        return true;
    };
    TableGetOp.prototype.operation = function (ctx, inObs) {
        console.log("TableGetOp " + JSON.stringify(ctx));
        return inObs.pipe(operators_1.flatMap(function (key) { return ctx.table.get(key); }));
    };
    return TableGetOp;
}(Operation_1.BasicOperation));
exports.TableGetOp = TableGetOp;
operationRegistry_1.registerOperation(TableGetOp);
var TableGetFirstOp = /** @class */ (function (_super) {
    __extends(TableGetFirstOp, _super);
    function TableGetFirstOp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "TableGetFirstOp";
        return _this;
    }
    TableGetFirstOp.prototype.security = function (ctx) {
        return true;
    };
    TableGetFirstOp.prototype.operation = function (ctx, inObs) {
        console.log("TableGetFirstOp " + JSON.stringify(ctx));
        return inObs.pipe(operators_1.flatMap(function (key) { return ctx.table.get(key); }), operators_1.first());
    };
    return TableGetFirstOp;
}(Operation_1.BasicOperation));
exports.TableGetFirstOp = TableGetFirstOp;
operationRegistry_1.registerOperation(TableGetFirstOp);
var TablePutOp = /** @class */ (function (_super) {
    __extends(TablePutOp, _super);
    function TablePutOp() {
        var _this = _super.call(this) || this;
        _this.name = "TablePutOp";
        return _this;
    }
    TablePutOp.prototype.security = function (ctx) {
        return true;
    };
    TablePutOp.prototype.operation = function (ctx, inObs) {
        return inObs.pipe(operators_1.flatMap(function (kv) {
            return ctx.table.put(kv.key, kv.value);
        }));
    };
    return TablePutOp;
}(Operation_1.BasicOperation));
exports.TablePutOp = TablePutOp;
operationRegistry_1.registerOperation(TablePutOp);
var TableFilterNotExists = /** @class */ (function (_super) {
    __extends(TableFilterNotExists, _super);
    function TableFilterNotExists() {
        var _this = _super.call(this) || this;
        _this.name = "TableFilterNotExists";
        return _this;
    }
    TableFilterNotExists.prototype.security = function (ctx) {
        return true;
    };
    TableFilterNotExists.prototype.operation = function (ctx, inObs) {
        var _this = this;
        return inObs.pipe(operators_1.flatMap(function (kv) {
            // console.log('filtering on ' + JSON.stringify(kv))
            return ctx.table.get(kv.key).pipe(operators_1.map(function (existing) { return [!!existing, kv]; }), operators_1.first());
        }), operators_1.tap(function (we) { return console.log("Filter res " + _this.getOpName() + " : " + we); }), operators_1.filter(function (withExisting) { return !withExisting[0]; }), operators_1.map(function (withExisting) { return withExisting[1]; }));
    };
    return TableFilterNotExists;
}(Operation_1.BasicOperation));
exports.TableFilterNotExists = TableFilterNotExists;
operationRegistry_1.registerOperation(TableFilterNotExists);
