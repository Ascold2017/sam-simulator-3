import { ClientToServerEvents, ServerToClientEvents } from "@shared/models/sockets.model";
import { DI } from "../config/dataSource";
import { missionDto } from "../dto/mission.dto";
import { Core, MissionData, Position } from "../../core/app";
import { Server } from "socket.io";
import { CustomSocket } from "../types";
import { v4 as uuidv4 } from 'uuid';

interface PlayerData {
    socket: CustomSocket; // Сокет игрока
    aaId: string;
    position: Position; // Позиция для зенитки
}

export class GameInstanceController {
    private coreInstance: Core;
    private io: Server<ClientToServerEvents, ServerToClientEvents>;
    private players: Map<string, PlayerData> = new Map();
    private missionData: MissionData;

    constructor(missionId: number, io: Server) {
        this.io = io;
        this.coreInstance = new Core();
        this.startMission(missionId);
    }

    public addPlayer(socket: CustomSocket) {
        const aa = socket.data.user.aa;

        // Проверяем, есть ли свободные позиции
        const availablePosition = this.getAvailablePosition();

        if (!availablePosition) {
            // Если нет доступных позиций, отправляем ошибку
            socket.emit("error", "No available AA positions");
            return;
        }

        const aaId = uuidv4();

        // Сохраняем игрока с его позицией в карте players
        this.players.set(socket.id, { socket, position: availablePosition, aaId });

        console.log(`Player ${socket.id} added to the game at position:`, availablePosition);

        // Добавляем зенитку игрока в Core (используем aa данные и позицию)
        this.coreInstance.addAA({
            id: aaId,
            position: availablePosition,
            type: aa.type,
            ammoVelocity: aa.ammoVelocity,
            ammoMaxRange: aa.ammoMaxRange,
            viewAngle: aa.viewAngle,
        });

        // Отправляем окружение игроку
        this.sendEnvironment(socket.id);

        // Подписываемся на событие смены позиции
        socket.on('change_aa_position', (newPosition) => this.changePosition(socket, newPosition));
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
    private changePosition(socket: CustomSocket, newPosition: Position) {
        const playerData = this.players.get(socket.id);

        if (!playerData) {
            socket.emit("error", "Player not found");
            return;
        }

        // Проверяем, занята ли новая позиция
        if (this.isPositionOccupied(newPosition)) {
            socket.emit("error", "Position is already occupied");
            return;
        }

        // Освобождаем текущую позицию и обновляем игрока
        console.log(`Player ${socket.id} is moving from position:`, playerData.position);

        // Удаляем старую зенитку из Core и добавляем новую с обновленной позицией
        this.coreInstance.removeAA(playerData.aaId);
        this.coreInstance.addAA({
            id: playerData.aaId,
            position: newPosition,
            type: socket.data.user.aa.type,
            ammoVelocity: socket.data.user.aa.ammoVelocity,
            ammoMaxRange: socket.data.user.aa.ammoMaxRange,
            viewAngle: socket.data.user.aa.viewAngle,
        });

        // Обновляем позицию игрока в `players`
        playerData.position = newPosition;
        this.players.set(socket.id, playerData);

        console.log(`Player ${socket.id} moved to new position:`, newPosition);
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

    // Отправка окружения игроку
    private sendEnvironment(playerId: string) {
        const heightmapTerrain = this.coreInstance.getHeightmapTerrain();
        const aas = this.coreInstance.getAAs();

        this.io.to(playerId).emit('mission_environment', {
            map: {
                data: heightmapTerrain.data,
                size: heightmapTerrain.elementSize
            },
            aas
        });
    }

    // Получение первой доступной позиции для AA
    private getAvailablePosition(): Position | undefined {
        const takenPositions = Array.from(this.players.values()).map((player) => player.position);
        return this.missionData.aaPositions.find(
            (position) => !takenPositions.some((takenPosition) => this.isSamePosition(position, takenPosition))
        );
    }

    // Проверка, занята ли позиция
    private isPositionOccupied(position: Position): boolean {
        return Array.from(this.players.values()).some(
            (player) =>
                this.isSamePosition(player.position, position)
        );
    }

    // Сравнение двух позиций
    private isSamePosition(pos1: Position, pos2: Position): boolean {
        return pos1.x === pos2.x && pos1.y === pos2.y && pos1.z === pos2.z;
    }
}
