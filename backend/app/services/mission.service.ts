import { DI } from "../config/dataSource";

export class MissionService {

    async getAllMissions() {
        const missions = await DI.missionRepository.find({
            select: ['id', 'name'],
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
}