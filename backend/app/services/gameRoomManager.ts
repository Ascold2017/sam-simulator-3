import { Server, Socket } from "socket.io";
import { GameInstance } from "./gameInstance";
import { DI } from "../config/dataSource";
import { ClientToServerEvents, MissionRoom, ServerToClientEvents } from '../../../shared/models/sockets.model'

export class GameRoomManager {
    private io: Server<ClientToServerEvents, ServerToClientEvents>;
    private missionRooms: Map<number, GameInstance> = new Map(); // key - mission.id

    constructor(io: Server) {
        this.io = io;
    }

    async getMissionRooms(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
        try {
            // Получаем миссии из базы данных
            const missions = await DI.missionRepository.find({
                select: ['id', 'name'],
                where: {}
            });

            // Преобразуем миссии, добавляя поле isCreated
            const result = missions.map((mission) => {
                return {
                    id: mission.id,
                    name: mission.name,
                    isCreated: this.missionRooms.has(mission.id) // Если комната с миссией создана, то true
                };
            });

            socket.emit('mission_rooms', result)
        } catch (error) {
            console.error('Error fetching missions:', error);
            return []
        }
    }

    // Создать комнату и игру
    public createRoom(missionId: number): void {
        if (this.missionRooms.has(missionId)) {
            console.log(`Mission room ${missionId} already exists`);
            return;
        }

        const gameInstance = new GameInstance(missionId, this.io);
        this.missionRooms.set(missionId, gameInstance);
        console.log(`Mission room ${missionId} created with a new game instance`);

        this.io.emit('mission_room_created', missionId);
    }

    // Присоединение к комнате
    public joinRoom(socket: Socket, missionId: number): void {
        const game = this.missionRooms.get(missionId);
        if (!game) {
            socket.emit('error', `Room ${missionId} does not exist`);
            return;
        }

        socket.join(missionId.toString());
        game.addPlayer(socket);
        console.log(`Player ${socket.id} joined room ${missionId}`);
        this.io.to(missionId.toString()).emit('player_joined', missionId);

        // Удаление игрока при отключении
        socket.on('disconnect', () => {
            game.removePlayer(socket.id);
            console.log(`Player ${socket.id} disconnected and removed from room ${missionId}`);
        });
    }

    // Удаление комнаты и завершение игры
    public deleteRoom(missionId: number): void {
        const game = this.missionRooms.get(missionId);
        if (!game) {
            console.log(`Room ${missionId} does not exist`);
            return;
        }

        game.stopMission();
        this.missionRooms.delete(missionId);
        console.log(`Room ${missionId} deleted`);

        this.io.emit('room_deleted', missionId);
        this.io.socketsLeave(missionId.toString());  // Отключаем всех игроков от комнаты
    }

    public leaveRoom(socket: Socket, missionId: number) {
        const game = this.missionRooms.get(missionId);
        if (!game) {
            socket.emit('error', `Room ${missionId} does not exist`);
            return;
        }

        game.removePlayer(socket.id);
        this.io.emit('player_leaved', socket.id);
    }
}
