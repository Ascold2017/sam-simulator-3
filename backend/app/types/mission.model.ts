import { Position } from "./sockets.model";

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
        data: number[][];
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
        waypoints: { speed: number, position: Position }[]
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
        waypoints:  { speed: number, position: Position }[]
    }[]
    targetsToUpdate: {
        id: number,
        waypoints:  { speed: number, position: Position }[]
    }[],
    targetsToDelete: number[],
}