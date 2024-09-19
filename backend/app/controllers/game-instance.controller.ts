import { AAPosition, Core, MissionData } from "../../core/app";
import { Server } from "socket.io";
import {
  CustomSocket,
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/sockets.model";
import { v4 as uuidv4 } from "uuid";
import { Mission } from "../entities/mission.entity";
import sharp from "sharp";
import path from "path";

interface PlayerData {
  socket: CustomSocket; // Сокет игрока
  aaId: string;
  aaPositionId: number;
}

export class GameInstanceController {
  private coreInstance: Core;
  private roomId: string;
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private players: Map<string, PlayerData> = new Map();
  private missionData: Mission;

  constructor(roomId: string, missionData: Mission, io: Server) {
    this.io = io;
    this.roomId = roomId;
    this.coreInstance = new Core();
    this.missionData = missionData;
    this.startMission();
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
    this.players.set(socket.id, {
      socket,
      aaPositionId: availablePosition.id,
      aaId,
    });

    console.log(
      `Player ${socket.id} added to the game at position:`,
      availablePosition
    );

    // Добавляем зенитку игрока в Core (используем aa данные и позицию)
    this.coreInstance.addAA({
      id: aaId,
      position: availablePosition.position,
      type: user.aa.type,
      ammoVelocity: user.aa.ammoVelocity,
      ammoMaxRange: user.aa.ammoMaxRange,
      ammoKillRadius: user.aa.ammoKillRadius,
      captureAngle: user.aa.captureAngle,
    });

    // Отправляем окружение игроку
    this.sendEnvironment(socket.id);

    console.log(`Player ${socket.id} joined room ${this.roomId}`);
    this.io.to(this.roomId).emit("player_joined", {
      roomId: this.roomId,
      userId: user.id,
      username: user.username,
      aaPositionId: availablePosition.id,
    });

    socket.on('update_direction', ({ direction }) => {
      const capturedTargetId = this.coreInstance.updateAADirection(aaId, direction);
      socket.emit('captured_target', capturedTargetId);
    })
    socket.on("fire_target", () => {
      this.coreInstance.fire(aaId);
    });
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
      console.log("Game ended");
      this.players.clear();
      this.coreInstance.stopMission();
    } catch (error) {
      console.error(`Error stopping mission: ${error.message}`);
    }
  }

  // Запуск миссии
  private async startMission() {
    const parsedMissionData = await this.parseMissionData();

    this.coreInstance.startMission(parsedMissionData);
    console.log(`Mission ${this.missionData.name} started successfully`);

    this.coreInstance.updateListener = () => {
      this.sendUpdates();
    };
  }

  // Отправка окружения игроку
  private sendEnvironment(playerId: string) {
    const playerData = this.players.get(playerId);
    const heightmapTerrain = this.coreInstance.getHeightmapTerrain();
    const aas = this.coreInstance.getAAs();

    this.io.to(playerId).emit("mission_environment", {
      mapName: this.missionData.map.filename,
      aas,
      yourAAId: playerData.aaId,
      aaPositions: this.getAAPositions(),
    });
  }

  // Получение первой доступной позиции для AA
  private getAvailablePosition(): AAPosition | undefined {
    const takenAAPositionIds = Array.from(this.players.values()).map(
      (player) => player.aaPositionId
    );
    return this.missionData.aaPositions.find(
      (aaPosition) => !takenAAPositionIds.includes(aaPosition.id)
    );
  }

  private getAAPositions() {
    return this.missionData.aaPositions.map((aaPosition) => {
      const player = Array.from(this.players.values()).find(
        (playerData) => aaPosition.id === playerData.aaPositionId
      );
      return {
        id: aaPosition.id,
        position: aaPosition.position,
        aaId: player?.aaId || null, ///
      };
    });
  }

  private sendUpdates() {
    const flightObjects = this.coreInstance.getFlightObjects();
   
    this.io.to(this.roomId).emit("mission_update", {
      flightObjects,
    });
  }

  private async getHeightmapData(filename: string) {
    try {
      const imageUrl = `${process.env.STATIC_SERVER_BASE_URL}/${filename}/textures/heightmap.png`;
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const image = sharp(imageBuffer);
      const { width, height } = await image.metadata();
      const rawImageData = await image.raw().toBuffer();

      return {
        rawImageData,
        width,
        height,
      };
    } catch (e) {
      console.log(e)
      return {
        rawImageData: [0, 0, 0, 0, 0, 0, 0, 0],
        width: 1,
        height: 1,
      };
    }
  }

  private async parseMissionData(): Promise<MissionData> {
    const { rawImageData, width, height } = await this.getHeightmapData(
      this.missionData.map.filename
    );

    const mapSize = this.missionData.map.size;
    const maxHeight = 650;

    // Извлечение данных о пикселях изображения

    const heightData: number[][] = [];

    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const r = rawImageData[index]; // Используем только красный канал
        const normalizedHeight = Math.round((r / 255) * maxHeight);
        row.push(normalizedHeight);
      }
      heightData.push(row);
    }

    // Рассчитываем элементный размер
    const elementSize = Math.floor(mapSize / width);

    return {
      map: {
        data: heightData, // Данные высот
        size: elementSize,
      },
      aaPositions: this.missionData.aaPositions,
      targets: this.missionData.targets.map((mTarget) => ({
        id: mTarget.target.name,
        rcs: mTarget.target.rcs,
        temperature: mTarget.target.temperature,
        size: mTarget.target.size,
        waypoints: mTarget.waypoints,
      })),
    };
  }
}
