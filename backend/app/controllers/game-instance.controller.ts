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
      viewAngle: user.aa.viewAngle,
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

    socket.on("change_aa_position", (positionId) =>
      this.changePosition(socket, positionId)
    );
    socket.on("capture_target", ({ azimuth, elevation }) => {
      this.coreInstance.captureTargetOnDirection(aaId, azimuth, elevation);
    });
    socket.on("fire_target", ({ azimuth, elevation }) => {
      this.coreInstance.fire(aaId, azimuth, elevation);
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
    console.log(
      `Player ${socket.id} is moving from position:`,
      playerData.aaPositionId
    );

    // Удаляем старую зенитку из Core и добавляем новую с обновленной позицией
    this.coreInstance.removeAA(playerData.aaId);
    const newPosition = this.missionData.aaPositions.find(
      (p) => p.id === positionId
    );
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
    this.io
      .to(this.roomId)
      .emit("mission_aas_update", this.coreInstance.getAAs());
    this.io
      .to(this.roomId)
      .emit("mission_aas_positions_update", this.getAAPositions());
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

  // Проверка, занята ли позиция
  private isPositionOccupied(positionId: number): boolean {
    return Array.from(this.players.values()).some(
      (player) => player.aaPositionId === positionId
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
    const capturedTargets = this.coreInstance.getCapturedTargets();
    this.io.to(this.roomId).emit("mission_update", {
      flightObjects,
      capturedTargets,
    });
  }

  private async getHeightmapData(filename: string) {
    try {
      const imageUrl = `${process.env.STATIC_SERVER_BASE_URL}${filename}/textures/heightmap.png`;
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
