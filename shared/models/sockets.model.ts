import { Position, MapData, AAObject } from "@core/app";


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
    disconnect: () => void;
}

export interface AAPosition {
    id: number;
    position: Position;
    isOccupied: boolean
}
export interface MissionData {
    map: MapData;
    aas: AAObject[];
    yourAAId: string;
    aaPositions: AAPosition[]
}

export interface PlayerJoinedData {
    userId: number;
    username: string;
    aaPositionId: number
}
export interface ServerToClientEvents {
    mission_rooms: (missions: MissionRoom[]) => void;
    mission_room_created: (payload: { id: string; missionId: MissionID }) => void;
    player_joined: (data: PlayerJoinedData) => void;
    player_leaved: (roomId: string) => void;
    room_deleted: (roomId: string) => void;
    mission_environment: (missionData: MissionData) => void;
    mission_aas_update: (aas: MissionData['aas']) => void;
    error: (error: string) => void;
    
}
