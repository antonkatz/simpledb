/// <reference types="node" />
export default function startStreamingServer(key: Buffer, cert: Buffer, eventListeners?: {
    onDisconnect?: (socketId: string) => void;
}): Promise<void>;
//# sourceMappingURL=socket-api.d.ts.map