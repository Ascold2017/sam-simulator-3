import { Socket } from "socket.io";
import { Position, AAObject, FlightObjectDTO } from "@core/app"
import { User } from "app/entities/user.entity";


export interface MissionRoom {
    id: string;
    endedAt: number;
    missionId: number;
}
export type MissionID = number;
export interface ClientToServerEvents {
    create_mission_room: (missionId: MissionID) => void;
    join_mission_room: (roomId: string) => void;
    leave_mission_room: (roomId: string) => void;
    delete_mission_room: (roomId: string) => void;
    update_direction: (payload: { direction: Position }) => void;
    fire_target: () => void;
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
}
export interface ServerToClientEvents {
    mission_rooms: (missions: MissionRoom[]) => void;
    mission_room_created: (payload: MissionRoom) => void;
    player_joined: (data: PlayerJoinedData) => void;
    player_leaved: (roomId: string) => void;
    room_deleted: (roomId: string) => void;
    mission_environment: (missionData: MissionData) => void;
    mission_aas_update: (aas: MissionData['aas']) => void;
    mission_update: (missionUpdate: MissionUpdate) => void;
    captured_target: (capturedTargetId: string | null) => void;
    error: (error: string) => void;
    
}

export interface CustomSocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
    data: {
        user: User
    }
}