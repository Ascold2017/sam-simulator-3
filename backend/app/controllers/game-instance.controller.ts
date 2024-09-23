import { Core } from "../../core/app";
import { Server } from "socket.io";
import {
  CustomSocket,
  ClientToServerEvents,
  ServerToClientEvents,
  AAPosition,
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
        data: [ [0, 0], [0, 0]],
        width: missionData.map.size,
        height: missionData.map.size,
      },
      targetNPCs: missionData.targets.map(t => ({
        id: t.id.toString(),
        rcs: t.target.rcs,
        size: t.target.size,
        temperature: t.target.temperature,
        waypoints: t.waypoints
      }))
    });

    this.coreInstance.eventEmitter.on('update_world_state', (state) => {
      this.io.to(this.roomId).emit('update_world_state', state)
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

    // Добавляем зенитку игрока в Core (используем aa данные и позицию)
    this.coreInstance.addAA({
      id: aaId,
      position: availablePosition.position,
      type: 'guided-missile', //user.aa.type,
      ammoCount: 10,
      ammoProps: {
        minRange: 50,
        activeRange: user.aa.ammoMaxRange * 0.5,
        maxRange: user.aa.ammoMaxRange,
        maxVelocity: user.aa.ammoVelocity,
        killRadius: user.aa.ammoKillRadius,
        maxOverload: 100500
      },
      radarProps: {
        range: user.aa.ammoMaxRange
      }
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
      this.coreInstance.eventEmitter.emit('update_aa_aim_ray', { aaId: aaId, aimRay: [direction.x, direction.y, direction.z] });
    })
    socket.on("fire_target", () => {
      this.coreInstance.eventEmitter.emit("fire_aa", { aaId });
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
      aaPositions: this.getAAPositions(),
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

}
