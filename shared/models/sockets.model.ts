import { Position, AAObject, FlightObjectDTO, CapturedTarget } from "../../backend/core/app";


export interface MissionRoom {
    id: string;
    missionId: number;
}
export type MissionID = number;
export interface ClientToServerEvents {
    create_mission_room: (missionId: MissionID) => void;
    join_mission_room: (roomId: string) => void;
    leave_mission_room: (roomId: string) => void;
    delete_mission_room: (roomId: string) => void;
    change_aa_position: (positionId: number) => void;
    capture_target: (payload: { azimuth: number; elevation: number }) => void;
    fire_target: (payload: { azimuth: number; elevation: number }) => void;
    disconnect: () => void;
}

export interface AAPosition {
    id: number;
    position: Position;
    aaId: string;
}
export interface MissionData {
    mapName: string;
    aas: AAObject[];
    yourAAId: string;
    aaPositions: AAPosition[];
}

export interface PlayerJoinedData {
    roomId: string
    userId: number;
    username: string;
    aaPositionId: number
}

export interface MissionUpdate {
    flightObjects: FlightObjectDTO[];
    capturedTargets: CapturedTarget[]
}
export interface ServerToClientEvents {
    mission_rooms: (missions: MissionRoom[]) => void;
    mission_room_created: (payload: { id: string; missionId: MissionID }) => void;
    player_joined: (data: PlayerJoinedData) => void;
    player_leaved: (roomId: string) => void;
    room_deleted: (roomId: string) => void;
    mission_environment: (missionData: MissionData) => void;
    mission_aas_update: (aas: MissionData['aas']) => void;
    mission_aas_positions_update: (aaPositions: MissionData['aaPositions']) => void;
    mission_update: (missionUpdate: MissionUpdate) => void;
    error: (error: string) => void;
    
}
