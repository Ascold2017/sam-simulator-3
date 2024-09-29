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
export type MissileGuidanceMethod = "default" | "3p" | "1/2";
export interface ClientToServerEvents {
  create_mission_room: (missionId: MissionID) => void;
  join_mission_room: (roomId: string) => void;
  leave_mission_room: (roomId: string) => void;
  delete_mission_room: (roomId: string) => void;
  update_direction: (payload: { direction: Position }) => void;
  fire_target: (guidanceMethod: MissileGuidanceMethod) => void;
  capture_target: () => void;
  reset_target: () => void;
  disconnect: () => void;
}

export interface MissionData {
  mapName: string;
  yourAAId: string;
}

export interface PlayerJoinedData {
  roomId: string;
  userId: number;
  username: string;
  aaPositionId: number;
}

export interface ServerToClientEvents {
  mission_rooms: (missions: MissionRoom[]) => void;
  mission_room_created: (payload: MissionRoom) => void;
  player_joined: (data: PlayerJoinedData) => void;
  player_leaved: (roomId: string) => void;
  room_deleted: (roomId: string) => void;
  mission_environment: (missionData: MissionData) => void;
  update_world_state: (state: EntityState[]) => void;
  target_killed: (state: TargetNPCState) => void;
  missile_launched: (state: MissileState) => void;
  missile_overloaded: (state: MissileState) => void;
  missile_over_distance: (state: MissileState) => void;
  error: (error: string) => void;
}

export interface EntityState {
  id: string;
  entityId: number | null;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  isDestroyed: boolean;
  type: string;
}

export interface AAState extends EntityState {
  type: "aa";
  userId: number;
  username: string;
  ammoCount: number;
  readyToFire: boolean;
  aimRay: [number, number, number];
  captureAngle: number;
  launchedMissileIds: string[];
  capturedTargetId: string | null;
  detectedTargetIds: string[];
  maxRange: number;
  minRange: number;
}

export interface FlightObjectState extends EntityState {
  type: "flight-object" | string;
  velocity: [number, number, number];
  isKilled: boolean;
}

export interface TargetNPCState extends FlightObjectState {
  type: "target-npc";
  rcs: number;
  temperature: number;
  size: number;
}

export interface MissileState extends FlightObjectState {
  type: "missile";
  exploded: boolean;
  guidanceMethod: MissileGuidanceMethod;
  isActiveRange: boolean;
}
