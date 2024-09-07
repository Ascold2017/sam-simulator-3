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
    change_aa_position: (position: Position) => void;
    disconnect: () => void;
}

export interface MissionData {
    map: MapData;
    aas: AAObject[];
    yourAAId: string
}

export interface PlayerJoinedData {
    userId: number;
    username: string;
    position: Position
}
export interface ServerToClientEvents {
    mission_rooms: (missions: MissionRoom[]) => void;
    mission_room_created: (payload: { id: string; missionId: MissionID }) => void;
    player_joined: (data: PlayerJoinedData) => void;
    player_leaved: (roomId: string) => void;
    room_deleted: (roomId: string) => void;
    mission_environment: (missionData: MissionData) => void;
    error: (error: string) => void;
    
}
