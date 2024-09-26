import { Core } from "../../core/app";
import { Server } from "socket.io";
import {
  CustomSocket,
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/sockets.model";
import { v4 as uuidv4 } from "uuid";
import { Mission } from "../entities/mission.entity";
import { MissionAAPosition } from "app/entities/missionAAPosition";

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

    this.coreInstance = new Core({
      heightmapTerrain: {
        data: missionData.map.data,
        width: missionData.map.size,
        height: missionData.map.size,
      },
      targetNPCs: missionData.targets.map(t => ({
        id: t.id.toString(),
        rcs: t.target.rcs,
        size: t.target.size,
        temperature: t.target.temperature,
        waypoints: t.waypoints,
        entityId: t.target.id
      }))
    });

    this.coreInstance.eventEmitter.on('update_world_state', (state) => {
      this.io.to(this.roomId).emit('update_world_state', state)
    })
    this.coreInstance.eventEmitter.on('target_killed', (state) => {
      this.io.to(this.roomId).emit('target_killed', state)
    })

    this.missionData = missionData;
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

    // Добавляем зенитку игрока в Core
    this.coreInstance.addAA({
      id: aaId,
      position: availablePosition.position,
      missileCount: user.aa.missileCount,
      reloadTime: user.aa.reloadTime,
      missileProps: {
        minRange: user.aa.missileMinRange,
        maxRange: user.aa.missileMaxRange,
        maxVelocity: user.aa.missileVelocity,
        killRadius: user.aa.missileKillRadius,
        maxOverload: user.aa.missileMaxOverload,

      },
      radarProps: {
        range: user.aa.missileMaxRange,
        captureAngle: user.aa.captureAngle
      }
    });

    // Отправляем окружение игроку
    this.sendEnvironment(socket.id);

    console.log(`Player ${socket.id} joined room ${this.roomId}`);
    this.io.to(this.roomId).emit("player_joined", {
      roomId: this.roomId,
      userId: user.id,
      username: user.username,
    });

    socket.on('update_direction', ({ direction }) => {
      this.coreInstance.updateAAAimRay(aaId, [direction.x, direction.y, direction.z]);
    })
    socket.on("fire_target", () => {
      this.coreInstance.fireAA(aaId)
    });
    socket.on('capture_target', () => {
      this.coreInstance.captureTarget(aaId)
    })
    socket.on('reset_target', () => {
      this.coreInstance.resetTarget(aaId)
    })
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
      // this.coreInstance.stopMission();
    } catch (error) {
      console.error(`Error stopping mission: ${error.message}`);
    }
  }


  // Отправка окружения игроку
  private sendEnvironment(playerId: string) {
    const playerData = this.players.get(playerId);

    this.io.to(playerId).emit("mission_environment", {
      mapName: this.missionData.map.filename,
      yourAAId: playerData.aaId,
    });
  }

  // Получение первой доступной позиции для AA
  private getAvailablePosition(): MissionAAPosition | undefined {
    const takenAAPositionIds = Array.from(this.players.values()).map(
      (player) => player.aaPositionId
    );
    return this.missionData.aaPositions.find(
      (aaPosition) => !takenAAPositionIds.includes(aaPosition.id)
    );
  }

}
