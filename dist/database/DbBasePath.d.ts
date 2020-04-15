declare class GlobalBasePath {
    private subject;
    setPath(path: string): void;
    get path(): Promise<string>;
}
declare const DbBasePath: GlobalBasePath;
export default DbBasePath;
//# sourceMappingURL=DbBasePath.d.ts.map