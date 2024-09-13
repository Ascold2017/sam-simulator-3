import { CreateMissionPayload } from "app/types/mission.model";
import { DI } from "../config/dataSource";
import { EntityManager } from "typeorm";
import { Mission } from "../entities/mission.entity";
import { MissionAAPosition } from "../entities/missionAAPosition";
import { MissionTarget } from "../entities/missionTarget.entity";

export class MissionService {

    async getAllMissions() {
        const missions = await DI.missionRepository.find({
            select: ['id', 'name'],
            where: {}
        });

        return missions
    }

    async getAllMissionsExtended() {
        const missions = await DI.missionRepository.find({
            select: ['id', 'name'],
            relations: ['map'],
            where: {}
        });

        return missions
    }

    async getMissionById(id: number) {
        const missionData = await DI.missionRepository.findOneOrFail({
            where: { id },
            relations: ['targets', 'map', 'targets.target', 'aaPositions'],
        });

        return missionData
    }

    async createMission(data: CreateMissionPayload) {
        return await DI.dataSource.transaction(async (manager: EntityManager) => {
            // Найдем карту по mapId
            const map = await manager.findOneOrFail(DI.mapRepository.target, {
                where: { id: data.mapId }
            });

            // Создаем новую миссию и связываем её с картой
            const mission = new Mission();
            mission.name = data.name;
            mission.map = map;
            mission.duration = 1000; // TODO

            // Сохраняем миссию через транзакционный менеджер
            await manager.save(mission);

            // Создаем AA позиции для миссии
            for (const aaPositionData of data.aaPositionsToCreate) {
                const aaPosition = new MissionAAPosition();
                aaPosition.mission = mission;
                aaPosition.position = aaPositionData.position;
                await manager.save(aaPosition);
            }

            // Создаем цели и их маршруты
            for (const targetData of data.targetsToCreate) {
                const target = await manager.findOneOrFail(DI.targetRepository.target, {
                    where: { id: targetData.targetId }
                });

                // Создаем запись MissionTarget
                const missionTarget = new MissionTarget();
                missionTarget.mission = mission;
                missionTarget.target = target;
                missionTarget.waypoints = targetData.waypoints;
                await manager.save(missionTarget);
            }

            // Возвращаем созданную миссию
            return mission.id;
        });

    }
}