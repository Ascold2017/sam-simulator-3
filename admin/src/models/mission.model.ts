import { Target } from "./targets.model";

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

export interface Position {
    x: number;
    y: number;
    z: number;
}

export interface AAPosition {
    id: number;
    position: Position
}

export interface Waypoint {
    position: Position;
    speed: number;
}

export interface MissionTarget {
    id: number;
    target: Target;
    waypoints: Waypoint[]
}

export interface AdmMissionExtended {
    id: number;
    name: string;
    map: {
        id: number;
        name: string;
        filename: string;
        size: number;
        maxHeight: number;
        createdAt: number;
    },
    duration: number;
    aaPositions: AAPosition[];
    targets: MissionTarget[]
}
export type AdmMissionListResponse = AdmMission[]
export type AdmMissionExtendedResponse = AdmMissionExtended


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