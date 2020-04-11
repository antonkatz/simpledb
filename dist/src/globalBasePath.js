"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalBasePath = new class {
    constructor() {
        this.res = () => { };
        this._path = new Promise(_res => this.res = _res);
    }
    setPath(path) {
        if (path.charAt(path.length - 1) != '/') {
            this.res(path + '/');
        }
        else {
            this.res(path);
        }
    }
    get path() {
        return this._path;
    }
};
