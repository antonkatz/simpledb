export const globalBasePath = new class {
    res: (path: string) => void = () => {}
    _path: Promise<string> = new Promise<string>(_res => this.res = _res)

    setPath(path: string) {
        if (path.charAt(path.length - 1) != '/') {
            this.res(path + '/')
        } else {
            this.res(path)
        }
    }

    get path(): Promise<string> {
        return this._path
    }
}