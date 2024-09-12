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
    aaPositions: AAPosition[];
    targets: MissionTarget[]
}
export type AdmMissionListResponse = AdmMission[]
export type AdmMissionExtendedResponse = AdmMissionExtended