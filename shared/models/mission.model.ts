import type { CapturedTarget, FlightObjectDTO, MapData, } from "../../backend/core/app";

export interface StartMissionPayload {
    missionId: number;
}

export interface MissionStartedResponse {
    success: boolean;
    missionId?: number;
    message?: string;
}


export interface MissionEnvironmentPayload {
    map: MapData;
}

export interface StopMissionPayload { }

export interface MissionStoppedResponse {
    success: boolean;
}

export type FlightObjectsUpdateResponse = FlightObjectDTO[]
export type CapturedTargetResponse = CapturedTarget[]


export interface Mission {
    id: number;
    name: string;
}
export type MissionListResponse = Mission[]