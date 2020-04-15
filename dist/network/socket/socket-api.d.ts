/// <reference types="node" />
import { Socket } from "socket.io";
export default function startStreamingServer(key: Buffer, cert: Buffer, eventListeners?: {
    onDisconnect?: (socket: Socket) => void;
}): Promise<void>;
//# sourceMappingURL=socket-api.d.ts.map