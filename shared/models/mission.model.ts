import type { MapData, Position } from "../../backend/core/app";

export interface StartMissionPayload {
    missionId: number;
}

export interface MissionStartedResponse {
    success: boolean;
    missionId?: number;
    message?: string;
}

export interface RadarResponse {
    id: string;
    position: Position;
    type: "search-radar" | "sector-radar" | "unknown";
    minElevationAngle: number;
    maxElevationAngle: number;
    detectionRange: number;
    isEnabled: boolean;
}

export interface MissionEnvironmentPayload {
    map: MapData
}

export interface StopMissionPayload {}

export interface MissionStoppedResponse {
    success: boolean;
}