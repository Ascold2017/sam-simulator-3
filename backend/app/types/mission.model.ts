import { Position, Waypoint } from "@core/app";

export interface Mission {
    id: number;
    name: string;
}
export type MissionListResponse = Mission[]

export interface AdmMission {
    id: number;
    name: string;
    map: {
        id: number;
        name: string;
        filename: string;
        size: number;
        maxHeight: number;
        createdAt: number;
    }
}
export type AdmMissionListResponse = AdmMission[]


export interface CreateMissionPayload {
    name: string,
    mapId: number,
    duration: number;
    aaPositionsToCreate: {
        position: Position
    }[];
    targetsToCreate: {
        targetId: number,
        waypoints: Waypoint[]
    }[]
}

export interface UpdateMissionPayload {
    name: string,
    mapId: number,
    duration: number;
    aaPositionsToCreate: {
        position: Position
    }[]
    aaPositionsToUpdate: {
        id: number,
        position: Position
    }[],
    aaPositionsToDelete: number[],
    targetsToCreate: {
        targetId: number,
        waypoints: Waypoint[]
    }[]
    targetsToUpdate: {
        id: number,
        waypoints: Waypoint[]
    }[],
    targetsToDelete: number[],
}