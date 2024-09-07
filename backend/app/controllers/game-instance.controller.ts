import { ClientToServerEvents, ServerToClientEvents } from "@shared/models/sockets.model";
import { DI } from "../config/dataSource";
import { missionDto } from "../dto/mission.dto";
import { AAPosition, Core, MissionData, Position } from "../../core/app";
import { Server } from "socket.io";
import { CustomSocket } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { MissionAAPosition } from "../entities/missionAAPosition";

interface PlayerData {
    socket: CustomSocket; // Сокет игрока
    aaId: string;
    aaPositionId: number;
}

export class GameInstanceController {
    private coreInstance: Core;
    private roomId: string
    private io: Server<ClientToServerEvents, ServerToClientEvents>;
    private players: Map<string, PlayerData> = new Map();
    private missionData: MissionData;

    constructor(roomId: string, missionId: number, io: Server) {
        this.io = io;
        this.roomId = roomId;
        this.coreInstance = new Core();
        this.startMission(missionId);
    }

    public addPlayer(socket: CustomSocket) {
        const user = socket.data.user;

        // Проверяем, есть ли свободные позиции
        const availablePosition = this.getAvailablePosition();

        if (!availablePosition) {
            // Если нет доступных позиций, отправляем ошибку
            socket.emit("error", "No available AA positions");
            return;
        }

        const aaId = uuidv4();

        // Сохраняем игрока с его позицией в карте players
        this.players.set(socket.id, { socket, aaPositionId: availablePosition.id, aaId });

        console.log(`Player ${socket.id} added to the game at position:`, availablePosition);

        

        // Добавляем зенитку игрока в Core (используем aa данные и позицию)
        this.coreInstance.addAA({
            id: aaId,
            position: availablePosition.position,
            type: user.aa.type,
            ammoVelocity: user.aa.ammoVelocity,
            ammoMaxRange: user.aa.ammoMaxRange,
            viewAngle: user.aa.viewAngle,
        });

        // Отправляем окружение игроку
        this.sendEnvironment(socket.id);

        console.log(`Player ${socket.id} joined room ${this.roomId}`);
        this.io.to(this.roomId).emit('player_joined', {
            userId: user.id,
            username: user.username,
            aaPositionId: availablePosition.id
        });

        // Подписываемся на событие смены позиции
        socket.on('change_aa_position', (positionId) => this.changePosition(socket, positionId));
    }

    // Удаление игрока
    public removePlayer(playerId: string) {
        const playerData = this.players.get(playerId);
        if (playerData) {
            console.log(`Player ${playerId} removed from the game`);
            this.coreInstance.removeAA(playerData.aaId); // Удаляем зенитку из Core
            this.players.delete(playerId); // Удаляем игрока из players
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

    // Смена позиции игрока
    private changePosition(socket: CustomSocket, positionId: number) {
        const playerData = this.players.get(socket.id);

        if (!playerData) {
            socket.emit("error", "Player not found");
            return;
        }

        // Проверяем, занята ли новая позиция
        if (this.isPositionOccupied(positionId)) {
            socket.emit("error", "Position is already occupied");
            return;
        }

        // Освобождаем текущую позицию и обновляем игрока
        console.log(`Player ${socket.id} is moving from position:`, playerData.aaPositionId);

        // Удаляем старую зенитку из Core и добавляем новую с обновленной позицией
        this.coreInstance.removeAA(playerData.aaId);
        const newPosition = this.missionData.aaPositions.find(p => p.id === positionId)
        this.coreInstance.addAA({
            id: playerData.aaId,
            position: newPosition.position,
            type: socket.data.user.aa.type,
            ammoVelocity: socket.data.user.aa.ammoVelocity,
            ammoMaxRange: socket.data.user.aa.ammoMaxRange,
            viewAngle: socket.data.user.aa.viewAngle,
        });

        // Обновляем позицию игрока в `players`
        playerData.aaPositionId = positionId;
        this.players.set(socket.id, playerData);

        console.log(`Player ${socket.id} moved to new position:`, newPosition);
        this.io.emit('mission_aas_update', this.coreInstance.getAAs())
        this.io.emit('mission_aas_positions_update', this.getAAPositions())
    }

    // Запуск миссии
    private async startMission(missionId: number) {
        try {
            const missionData = await DI.missionRepository.findOne({
                where: { id: missionId },
                relations: ['targets', 'map', 'targets.target', 'aaPositions'],
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

    // Отправка окружения игроку
    private sendEnvironment(playerId: string) {
        const playerData = this.players.get(playerId);
        const heightmapTerrain = this.coreInstance.getHeightmapTerrain();
        const aas = this.coreInstance.getAAs();

        this.io.to(playerId).emit('mission_environment', {
            map: {
                data: heightmapTerrain.data,
                size: heightmapTerrain.elementSize
            },
            aas,
            yourAAId: playerData.aaId,
            aaPositions: this.getAAPositions()
        });
    }

    // Получение первой доступной позиции для AA
    private getAvailablePosition(): AAPosition | undefined {
        const takenAAPositionIds = Array.from(this.players.values()).map((player) => player.aaPositionId);
        return this.missionData.aaPositions.find((aaPosition) => !takenAAPositionIds.includes(aaPosition.id));
    }

    // Проверка, занята ли позиция
    private isPositionOccupied(positionId: number): boolean {
        return Array.from(this.players.values()).some(
            (player) => player.aaPositionId === positionId
        );
    }

    private getAAPositions() {
        return this.missionData.aaPositions.map(aaPosition => {
            const player = Array.from(this.players.values())
                .find((playerData) => aaPosition.id === playerData.aaPositionId);
            return {
            id: aaPosition.id,
            position: aaPosition.position,
            aaId: player?.aaId || null///
        }
    })
    }
}
