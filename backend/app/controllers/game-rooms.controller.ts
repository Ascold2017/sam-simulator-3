import { ClientToServerEvents, MissionID, ServerToClientEvents } from "@shared/models/sockets.model";
import { Server } from "socket.io";
import { GameInstanceController } from "./game-instance.controller";
import { v4 as uuidv4 } from 'uuid'
import { CustomSocket } from "../types";

interface MissionRoomInstance {
    id: string;
    missionId: MissionID;
    gameInstanceController: GameInstanceController;
}
export class GameRoomsController {
    private io: Server<ClientToServerEvents, ServerToClientEvents>;
    private missionRooms: MissionRoomInstance[] = []

    constructor(io: Server) {
        this.io = io;
        this.setupListeners();
    }

    private setupListeners() {
        this.io.on('connection', (socket: CustomSocket) => {
            // Список комнат
            this.getMissionRooms(socket)

            // Создать комнату
            socket.on('create_mission_room', (missionId) => {
                this.createRoom(missionId);
            });

            // Присоединиться к комнате
            socket.on('join_mission_room', (missionId) => {
                this.joinRoom(socket, missionId);
            });

            // Удалить комнату
            socket.on('delete_mission_room', (missionId) => {
                this.deleteRoom(missionId);
            });

            socket.on('leave_mission_room', (missionId) => {
                this.leaveRoom(socket, missionId)
            })

            // Отключение пользователя
            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });
    }

    private async getMissionRooms(socket: CustomSocket) {
        try {
            const result = this.missionRooms.map(mr => ({
                id: mr.id,
                missionId: mr.missionId,
            }));

            socket.emit('mission_rooms', result)
        } catch (error) {
            console.error('Error fetching missions:', error);
            return []
        }
    }

    // Создать комнату и игру
    private createRoom(missionId: number): void {
        const roomId =  uuidv4();
        const missionRoom = {
            id:roomId,
            missionId,
            gameInstanceController: new GameInstanceController(roomId, missionId, this.io)
        }
        this.missionRooms.push(missionRoom);
        console.log(`Mission room ${missionId} created with a new game instance`);

        this.io.emit('mission_room_created', {
            id: missionRoom.id,
            missionId
        });
    }

    // Присоединение к комнате
    private joinRoom(socket: CustomSocket, roomId: string): void {
        const room = this.missionRooms.find(room => room.id === roomId);
        if (!room) {
            socket.emit('error', `Room ${roomId} does not exist`);
            return;
        }

        socket.join(roomId);
        room.gameInstanceController.addPlayer(socket);
        

        // Удаление игрока при отключении
        socket.on('disconnect', () => {
            room.gameInstanceController.removePlayer(socket.id);
            console.log(`Player ${socket.id} disconnected and removed from room ${room.id}`);
        });
    }

    // Удаление комнаты и завершение игры
    private deleteRoom(roomId: string): void {
        const room = this.missionRooms.find(room => room.id === roomId);
        if (!room) {
            console.log(`Room ${roomId} does not exist`);
            return;
        }

        room.gameInstanceController.stopMission();
        this.missionRooms = this.missionRooms.filter(mr => mr.id !== roomId)
        console.log(`Room ${roomId} deleted`);

        this.io.emit('room_deleted', roomId);
        this.io.socketsLeave(roomId);  // Отключаем всех игроков от комнаты
    }

    private leaveRoom(socket: CustomSocket, roomId: string) {
        const room = this.missionRooms.find(room => room.id === roomId);
        if (!room) {
            socket.emit('error', `Room ${roomId} does not exist`);
            return;
        }

        room.gameInstanceController.removePlayer(socket.id);
        this.io.emit('player_leaved', socket.id);
    }
}
