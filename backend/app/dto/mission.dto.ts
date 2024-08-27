import { MissionData, RadarDTO } from "../../core/app";
import { Mission } from "../entities/mission.entity";

export const missionDto = (missionData: Mission): MissionData => ({
    map: missionData.map,
    targets: missionData.targets.map(target => ({
        id: target.name,
        rcs: target.rcs,
        temperature: target.temperature,
        size: target.size,
        waypoints: target.waypoints,
    })),
    radars: missionData.radars.map(radar => ({
        id: radar.name,
        position: radar.position,
        type: radar.type,
        minElevationAngle: radar.minElevationAngle,
        maxElevationAngle: radar.maxElevationAngle,
        maxDistance: radar.maxDistance,
    })),
    cameras: missionData.cameras.map(camera => ({
        id: camera.name,
        position: camera.position,
        type: camera.type,
        minElevationAngle: camera.minElevationAngle,
        maxElevationAngle: camera.maxElevationAngle,
        azimuthAngle: camera.azimuthAngle,
        viewAngle: camera.viewAngle,
    })),
})

export const radarDTO = (radar: RadarDTO) => ({
    id: radar.id,
    position: radar.position,
    type: radar.type,
    minElevationAngle: radar.minElevationAngle,
    maxElevationAngle: radar.maxElevationAngle,
    maxDistance: radar.detectionRange,
})