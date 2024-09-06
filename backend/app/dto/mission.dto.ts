import { MissionData } from "../../core/app";
import { Mission } from "../entities/mission.entity";

export const missionDto = (missionData: Mission): MissionData => ({
    map: missionData.map.map,
    targets: missionData.targets.map(mTarget => ({
        id: mTarget.target.name,
        rcs: mTarget.target.rcs,
        temperature: mTarget.target.temperature,
        size: mTarget.target.size,
        waypoints: mTarget.waypoints,
    }))
})
