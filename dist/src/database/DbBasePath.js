"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class GlobalBasePath {
    constructor() {
        this.subject = new rxjs_1.BehaviorSubject(undefined);
        process && process.env.DB_BASE_PATH && this.setPath(process.env.DB_BASE_PATH);
    }
    setPath(path) {
        if (path.charAt(path.length - 1) != '/') {
            this.subject.next(path + '/');
        }
        else {
            this.subject.next(path);
        }
    }
    get path() {
        return this.subject.pipe(operators_1.filter(_ => !!_), operators_1.first()).toPromise();
    }
}
const DbBasePath = new GlobalBasePath();
exports.default = DbBasePath;
