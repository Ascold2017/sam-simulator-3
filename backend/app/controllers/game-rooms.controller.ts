import {
  ClientToServerEvents,
  MissionID,
  ServerToClientEvents,
  CustomSocket,
} from "../types/sockets.model";
import { Server } from "socket.io";
import { GameInstanceController } from "./game-instance.controller";
import { v4 as uuidv4 } from "uuid";
import { MissionService } from "../services/mission.service";

interface MissionRoomInstance {
  id: string;
  missionId: MissionID;
  endedAt: number;
  gameInstanceController: GameInstanceController;
}
export class GameRoomsController {
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private missionService = new MissionService();
  private missionRooms: MissionRoomInstance[] = [];

  constructor(io: Server) {
    this.io = io;
    this.setupListeners();
    this.setupDaemon();
  }

  private setupListeners() {
    this.io.on("connection", (socket: CustomSocket) => {
      // Список комнат
      this.getMissionRooms(socket);

      // Создать комнату
      socket.on("create_mission_room", (missionId) => {
        this.createRoom(missionId);
      });

      // Присоединиться к комнате
      socket.on("join_mission_room", (missionId) => {
        this.joinRoom(socket, missionId);
      });

      // Удалить комнату
      socket.on("delete_mission_room", (missionId) => {
        this.deleteRoom(missionId);
      });

      socket.on("leave_mission_room", (missionId) => {
        this.leaveRoom(socket, missionId);
      });

      // Отключение пользователя
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  private setupDaemon() {
    setInterval(() => {
      this.missionRooms.forEach((room) => {
        if (room.endedAt <= +new Date()) {
          this.deleteRoom(room.id);
        }
      });
    }, 1000);
  }

  private async getMissionRooms(socket: CustomSocket) {
    try {
      const result = this.missionRooms.map((mr) => ({
        id: mr.id,
        endedAt: mr.endedAt,
        missionId: mr.missionId,
      }));

      socket.emit("mission_rooms", result);
    } catch (error) {
      console.error("Error fetching missions:", error);
      return [];
    }
  }

  // Создать комнату и игру
  private async createRoom(missionId: number) {
    try {
      const missionData = await this.missionService.getMissionById(missionId);
      const roomId = uuidv4();
      const endedAt = +new Date() + missionData.duration * 1000;
      const missionRoom = {
        id: roomId,
        missionId,
        endedAt,
        gameInstanceController: new GameInstanceController(
          roomId,
          missionData,
          this.io
        ),
      };
      this.missionRooms.push(missionRoom);
      console.log(`Mission room ${missionId} created with a new game instance`);

      this.io.emit("mission_room_created", {
        id: missionRoom.id,
        missionId,
        endedAt,
      });
    } catch (e) {
      this.io.emit("error", e?.message);
    }
  }

  // Присоединение к комнате
  private joinRoom(socket: CustomSocket, roomId: string): void {
    const room = this.missionRooms.find((room) => room.id === roomId);
    if (!room) {
      socket.emit("error", `Room ${roomId} does not exist`);
      return;
    }

    socket.join(roomId);
    room.gameInstanceController.addPlayer(socket);

    // Удаление игрока при отключении
    socket.on("disconnect", () => {
      this.io.to(roomId).emit("player_leaved", socket.id);
      room.gameInstanceController.removePlayer(socket.id);
      console.log(
        `Player ${socket.id} disconnected and removed from room ${room.id}`
      );
    });
  }

  // Удаление комнаты и завершение игры
  private deleteRoom(roomId: string): void {
    const room = this.missionRooms.find((room) => room.id === roomId);
    if (!room) {
      console.log(`Room ${roomId} does not exist`);
      return;
    }

    room.gameInstanceController.stopMission();
    this.missionRooms = this.missionRooms.filter((mr) => mr.id !== roomId);
    console.log(`Room ${roomId} deleted`);

    this.io.emit("room_deleted", roomId);
    this.io.socketsLeave(roomId); // Отключаем всех игроков от комнаты
  }

  private leaveRoom(socket: CustomSocket, roomId: string) {
    const room = this.missionRooms.find((room) => room.id === roomId);
    if (!room) {
      socket.emit("error", `Room ${roomId} does not exist`);
      return;
    }

    room.gameInstanceController.removePlayer(socket.id);
    this.io.to(roomId).emit("player_leaved", socket.id);
    socket.leave(roomId);
  }
}
