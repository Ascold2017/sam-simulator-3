import { AAObjectDTO, MapData } from "core/app";

export interface MissionRoom {
    id: number;
    name: string;
    isCreated: boolean;
}
export type MissionID = number;
export interface ClientToServerEvents {
    create_mission_room: (missionId: MissionID) => void;
    join_mission_room: (missionId: MissionID) => void;
    leave_mission_room: (missionId: MissionID) => void;
    delete_mission_room: (missionId: MissionID) => void;
    disconnect: () => void;
}

export interface MissionData {
    map: MapData;
    aas: AAObjectDTO[]
}
export interface ServerToClientEvents {
    mission_rooms: (missions: MissionRoom[]) => void;
    mission_room_created: (missionId: MissionID) => void;
    player_joined: (missionId: MissionID) => void;
    player_leaved: (socketId: string) => void;
    room_deleted: (missionId: MissionID) => void;
    mission_environment: (missionData: MissionData) => void;
    
}
