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
    targets: {
        id: number;
        target: Target;
        waypoints: {
            speed: number;
            position: Position
        }[]
    }[]
}
export type AdmMissionListResponse = AdmMission[]
export type AdmMissionExtendedResponse = AdmMissionExtended