import { ClientToServerEvents, ServerToClientEvents } from "@shared/models/sockets.model";
import { Core } from "../../core/app";
import { Socket } from "socket.io";

export class GamePlayerController {
    private coreInstance: Core;
    private socket: Socket<ClientToServerEvents, ServerToClientEvents>;
    constructor(core: Core, socket: Socket) {
        this.coreInstance = core;
        this.socket = socket;
        this.sendEnvironment();

        // TODO
    }

    private sendEnvironment() {
        const heightmapTerrain = this.coreInstance.getHeightmapTerrain();
        const aas = this.coreInstance.getAAs();
        this.socket.emit('mission_environment', {
            map: {
                data: heightmapTerrain.data,
                size: heightmapTerrain.elementSize
            },
            aas
        })
    }
}