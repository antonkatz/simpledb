"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalBasePath = new /** @class */ (function () {
    function class_1() {
        var _this = this;
        this.res = function () { };
        this._path = new Promise(function (_res) { return _this.res = _res; });
    }
    class_1.prototype.setPath = function (path) {
        if (path.charAt(path.length - 1) != '/') {
            this.res(path + '/');
        }
        else {
            this.res(path);
        }
    };
    Object.defineProperty(class_1.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    return class_1;
}());
