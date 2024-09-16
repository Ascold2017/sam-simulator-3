export interface Position {
  x: number;
  y: number;
  z: number;
}

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

export interface AAObject {
  id: string;
  position: Position;
  type: "missile" | "gun";
  ammoVelocity: number;
  ammoMaxRange: number;
  viewAngle: number;
}
export interface MissionData {
  mapName: string;
  aas: AAObject[];
  yourAAId: string;
  aaPositions: AAPosition[];
}

export interface PlayerJoinedData {
  roomId: string;
  userId: number;
  username: string;
  aaPositionId: number;
}

export interface FlightObject {
  id: string;
  isKilled: boolean;
  position: Position;
  velocity: Position;
  type: "target" | "missile" | "bullet" | "unknown";
}

export interface MissionUpdate {
  flightObjects: FlightObject[];
}
export interface ServerToClientEvents {
  mission_rooms: (missions: MissionRoom[]) => void;
  mission_room_created: (payload: MissionRoom) => void;
  player_joined: (data: PlayerJoinedData) => void;
  player_leaved: (roomId: string) => void;
  room_deleted: (roomId: string) => void;
  mission_environment: (missionData: MissionData) => void;
  mission_aas_update: (aas: MissionData["aas"]) => void;
  captured_target: (capturedTargetId: string | null) => void;
  mission_update: (missionUpdate: MissionUpdate) => void;
  error: (error: string) => void;
}
