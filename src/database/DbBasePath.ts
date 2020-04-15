import {BehaviorSubject, Subject} from "rxjs";
import {filter, first}            from "rxjs/operators";

class GlobalBasePath {
    private subject = new BehaviorSubject<string | undefined>(process && process.env.DB_BASE_PATH)

    setPath(path: string) {
        if (path.charAt(path.length - 1) != '/') {
            this.subject.next(path + '/')
        } else {
            this.subject.next(path)
        }
    }

    get path(): Promise<string> {
        return this.subject.pipe(
            filter(_ => !!_),
            first()
        ).toPromise() as Promise<string>
    }
}

const DbBasePath = new GlobalBasePath();
export default DbBasePath
