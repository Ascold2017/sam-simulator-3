import { ClientToServerEvents, ServerToClientEvents } from "@shared/models/sockets.model";
import { DI } from "../config/dataSource";
import { missionDto } from "../dto/mission.dto";
import { Core, MissionData } from "../../core/app";
import { Server, Socket } from "socket.io";

export class GameInstanceController {
    private coreInstance: Core;
    private io: Server<ClientToServerEvents, ServerToClientEvents>;
    private players: Map<string, Socket> = new Map(); 
    private missionData: MissionData;

    constructor(missionId: number,  io: Server) {
        this.io = io;
        this.coreInstance = new Core();
        this.startMission(missionId);
    }

    public addPlayer(socket: Socket) {
        this.players.set(socket.id, socket);
        console.log(`Player ${socket.id} added to the game`);
      
        ///this.coreInstance.addAA(...)
        // this.sendEnvironment(socket.id)
    }

    // Удаление игрока
    public removePlayer(playerId: string) {
        const socket = this.players.get(playerId);
        if (socket) {
            console.log(`Player ${playerId} removed from the game`);
            this.players.delete(playerId);
        }
    }

    // Завершение игры
    public stopMission() {
        try {
            console.log('Game ended');
            this.players.clear();
            this.coreInstance.stopMission();
        } catch (error) {
            console.error(`Error stopping mission: ${error.message}`);
        }
    }

    // Запуск миссии
    private async startMission(missionId: number) {
        try {
            const missionData = await DI.missionRepository.findOne({
                where: { id: missionId },
                relations: ['targets', 'map', 'targets.target'],
            });

            if (!missionData) {
                throw new Error(`Mission with ID ${missionId} not found`);
            }
            const parsedMissionData = missionDto(missionData);
            this.missionData = parsedMissionData;

            this.coreInstance.startMission(parsedMissionData);
            console.log(`Mission ${missionId} started successfully`);

        } catch (error) {
            console.error(`Error starting mission: ${error.message}`);
        }
    }

    private sendEnvironment(playerId: string) {
        const heightmapTerrain = this.coreInstance.getHeightmapTerrain();
        const aas = this.coreInstance.getAAs();
        
        this.io.to(playerId).emit('mission_environment', {
            map: {
                data: heightmapTerrain.data,
                size: heightmapTerrain.elementSize
            },
            aas
        })
    }
}