import { AppDataSource } from "../config/dataSource";
import { missionDto } from "../dto/mission.dto";
import { Mission } from "../entities/mission.entity";
import { Core } from "../../core/app";
import { Server, Socket } from "socket.io";
import { GameController } from "./gameController";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/models/sockets.model";

export class GameInstance {
    private coreInstance: Core;
    private io: Server<ClientToServerEvents, ServerToClientEvents>;
    private players: Map<string, Socket> = new Map(); 

    constructor(missionId: number,  io: Server) {
        this.io = io;
        this.coreInstance = new Core();
        this.startMission(missionId);
    }

    public addPlayer(socket: Socket) {
        this.players.set(socket.id, socket);
        console.log(`Player ${socket.id} added to the game`);
        new GameController(this.coreInstance, socket)
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
            const missionData = await AppDataSource.getRepository(Mission).findOne({
                where: { id: missionId },
                relations: ['targets', 'aas'],
            });

            if (!missionData) {
                throw new Error(`Mission with ID ${missionId} not found`);
            }

            const parsedMissionData = missionDto(missionData);
            this.coreInstance.startMission(parsedMissionData);
            console.log(`Mission ${missionId} started successfully`);

        } catch (error) {
            console.error(`Error starting mission: ${error.message}`);
        }
    }
}
