import { MissionData } from "../../core/app";
import { Mission } from "../entities/mission.entity";

export const missionDto = (missionData: Mission): MissionData => ({
    map: missionData.map,
    targets: missionData.targets.map(target => ({
        id: target.name,
        rcs: target.rcs,
        temperature: target.temperature,
        size: target.size,
        waypoints: target.waypoints,
    }))
})
