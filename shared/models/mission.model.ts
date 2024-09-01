import type { FlightObjectDTO, MapData, } from "../../backend/core/app";
import { AAObjectDTO } from "../../backend/core/app/dto/AAObject.dto";

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
    aas: AAObjectDTO[]
}

export interface StopMissionPayload { }

export interface MissionStoppedResponse {
    success: boolean;
}

export type FlightObjectsUpdateResponse = FlightObjectDTO[]