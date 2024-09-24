import { CreateMissionPayload, UpdateMissionPayload } from "app/types/mission.model";
import { DI } from "../config/dataSource";
import { EntityManager, In } from "typeorm";
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
            mission.duration = data.duration;

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

    async updateMission(id: number, data: UpdateMissionPayload) {
        return await DI.dataSource.transaction(async (manager: EntityManager) => {
            // Находим миссию по id
            const mission = await manager.findOneOrFail(Mission, {
                where: { id },
            });

            // Обновляем название миссии и карту
            mission.name = data.name;
            const map = await manager.findOneOrFail(DI.mapRepository.target, {
                where: { id: data.mapId }
            });
            mission.map = map;
            mission.duration = data.duration;

            // Обновляем AA позиции
            // Удаление
            if (data.aaPositionsToDelete.length) {
                await manager.delete(MissionAAPosition, { id: In(data.aaPositionsToDelete) });
            }

            // Добавление
            for (const aaPositionData of data.aaPositionsToCreate) {
                const aaPosition = new MissionAAPosition();
                aaPosition.mission = mission;
                aaPosition.position = aaPositionData.position;
                await manager.save(aaPosition);
            }

            // Обновление существующих AA позиций
            for (const aaPositionData of data.aaPositionsToUpdate) {
                const aaPosition = await manager.findOneOrFail(MissionAAPosition, {
                    where: { id: aaPositionData.id },
                });
                console.log(aaPosition, aaPositionData)
                aaPosition.position = aaPositionData.position;
                await manager.save(aaPosition); // Сохраняем изменения
            }

            // Обновляем цели
            // Удаление целей
            if (data.targetsToDelete.length) {
                await manager.delete(MissionTarget, { id: In(data.targetsToDelete) });
            }

            // Добавление новых целей
            for (const targetData of data.targetsToCreate) {
                const target = await manager.findOneOrFail(DI.targetRepository.target, {
                    where: { id: targetData.targetId }
                });

                const missionTarget = new MissionTarget();
                missionTarget.mission = mission;
                missionTarget.target = target;
                missionTarget.waypoints = targetData.waypoints;
                await manager.save(missionTarget);
            }

            // Обновление существующих целей и их маршрутов
            for (const targetUpdateData of data.targetsToUpdate) {
                const missionTarget = await manager.findOneOrFail(MissionTarget, {
                    where: { id: targetUpdateData.id },
                });

                missionTarget.waypoints = targetUpdateData.waypoints;
                missionTarget.target = await manager.findOneOrFail(DI.targetRepository.target, {
                    where: { id: targetUpdateData.targetId }
                })
                
                manager.save(missionTarget);
            }

            // Сохраняем обновленную миссию
            await manager.save(mission);

            return mission.id;
        });
    }

    async deleteMission(id: number) {
        return await DI.dataSource.transaction(async (manager: EntityManager) => {
            const mission = await manager.findOneOrFail(Mission, { where: { id } });
            await manager.remove(mission);  // Это автоматически удалит связанные targets и aaPositions
        });
    }
}