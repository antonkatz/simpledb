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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var index_1 = require("./index");
var Table = /** @class */ (function () {
    function Table(name, db, codec) {
        var _this = this;
        this.name = name;
        this.db = db;
        this.codec = codec;
        this.subject = new rxjs_1.Subject();
        this.put = function (key, value) {
            return new Promise(function (doneResolver) {
                // console.debug('Putting', key, value)
                _this.subject.next({ key: key, value: value, type: 'put', doneResolver: doneResolver });
            });
        };
        this.get = function (key) {
            console.log("Table [" + _this.name + "] .get '" + key + "' ");
            var existing = _this.db.then(function (db) { return db.get(key); })
                .then(_this.codec.rehydrate)
                .catch(function (e) {
                // throw new Error(`Could not get from table ${this.name} on key ${key}; ${e.message}`)
                // console.debug(`Could not get from table ${this.name} on key ${key}; ${e.message}`)
                return undefined;
            });
            var updateStream = _this.subject.pipe(operators_1.filter(function (e) { return e.key === key; }), operators_1.map(mapEntryStreamToEntry));
            // this prevents race conditions, making sure the freshest value is emitted last
            var hasNewValue = false;
            var pendingState = new rxjs_1.Observable(function (sub) {
                updateStream.subscribe(function (v) {
                    hasNewValue = true;
                    sub.next(v);
                });
                existing.then(function (v) {
                    if (!hasNewValue)
                        sub.next(v);
                    sub.complete();
                });
            });
            return rxjs_1.concat(pendingState, updateStream);
        };
        this.rangeSync = function (fromKey, toKey, limit, reverse) {
            if (limit === void 0) { limit = 1; }
            if (reverse === void 0) { reverse = false; }
            return __awaiter(_this, void 0, void 0, function () {
                var stream, res, p, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.db];
                        case 1:
                            stream = (_a.sent()).createReadStream({
                                gt: fromKey, lt: toKey, limit: limit, reverse: reverse
                            });
                            p = new Promise(function (_res) { return res = _res; });
                            result = [];
                            stream.on('data', function (row) {
                                var key = index_1.StringCodec.rehydrate(row.key);
                                var value = _this.codec.rehydrate(row.value);
                                result.push({ key: key, value: value });
                                console.log("rangeSync got row: " + key + "\n\t", JSON.stringify(value));
                            });
                            stream.on('end', function () {
                                console.debug('rangeSync got `end`');
                                res(result);
                            });
                            stream.resume();
                            return [2 /*return*/, p];
                    }
                });
            });
        };
        this.subject.subscribe(function (e) {
            var opPromise = _this.onEntry(e);
            notifyEnteree(e, opPromise);
        });
    }
    Table.prototype.onEntry = function (entry) {
        var _this = this;
        if (entry.type === 'del') {
            var opRes = this.db.then(function (db) { return db.del(entry.key, entry.value); });
            return Promise.resolve(entry.key);
        }
        else if (entry.type === "put") {
            var opRes = this.db.then(function (db) {
                return db.put(entry.key, _this.codec.dehydrate(entry.value)).then(function () { return entry.key; });
            });
            return opRes;
        }
        throw new Error('More operation types than accounted for in TableApi');
    };
    Table.prototype.toJSON = function () {
        return { resourceType: 'table', name: this.name };
    };
    return Table;
}());
exports.Table = Table;
function notifyEnteree(entry, opPromise) {
    opPromise.then(entry.doneResolver);
}
/** The entries should already be filtered based on key */
function mapEntryStreamToEntry(entry) {
    if (entry.type === 'put') {
        return entry.value;
    }
    else if (entry.type === 'del') {
        return undefined;
    }
    return;
}
